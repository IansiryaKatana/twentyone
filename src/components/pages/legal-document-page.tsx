import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/anim";

export type LegalController = {
  name: string;
  lines: string[];
  phone: string;
  phoneHref: string;
  email: string;
  web: string;
  webHref: string;
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  showAddress?: boolean;
  /** Optional inline link (e.g. Privacy Policy inside Terms). */
  link?: { label: string; to: "/privacy" | "/terms" };
};

export type LegalDoc = {
  eyebrow: string;
  title: string[];
  description: string;
  image?: string;
  controller: LegalController;
  sections?: LegalSection[];
  body_html?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function parseController(value: unknown, fallback: LegalController): LegalController {
  const r = asRecord(value);
  const lines = Array.isArray(r.lines)
    ? r.lines.filter((line): line is string => typeof line === "string")
    : fallback.lines;

  return {
    name: typeof r.name === "string" ? r.name : fallback.name,
    lines,
    phone: typeof r.phone === "string" ? r.phone : fallback.phone,
    phoneHref: typeof r.phoneHref === "string" ? r.phoneHref : fallback.phoneHref,
    email: typeof r.email === "string" ? r.email : fallback.email,
    web: typeof r.web === "string" ? r.web : fallback.web,
    webHref: typeof r.webHref === "string" ? r.webHref : fallback.webHref,
  };
}

function parseSections(value: unknown, fallback: LegalSection[]): LegalSection[] {
  if (!Array.isArray(value)) return fallback;

  const parsed: LegalSection[] = [];
  for (const item of value) {
    const s = asRecord(item);
    if (typeof s.id !== "string" || typeof s.title !== "string") continue;

    const section: LegalSection = {
      id: s.id,
      title: s.title,
      paragraphs: Array.isArray(s.paragraphs)
        ? s.paragraphs.filter((p): p is string => typeof p === "string")
        : [],
    };

    if (s.showAddress === true) section.showAddress = true;

    const link = asRecord(s.link);
    if (
      typeof link.label === "string" &&
      (link.to === "/privacy" || link.to === "/terms")
    ) {
      section.link = { label: link.label, to: link.to };
    }

    parsed.push(section);
  }

  return parsed.length > 0 ? parsed : fallback;
}

/** Merge CMS marketing page content with static fallback and site legal controller. */
export function resolveLegalDoc(
  cmsContent: unknown,
  fallback: LegalDoc,
  siteLegalController?: unknown,
): LegalDoc {
  if (!cmsContent || typeof cmsContent !== "object") return fallback;

  const c = asRecord(cmsContent);
  const controller = parseController(
    c.controller,
    parseController(siteLegalController, fallback.controller),
  );

  const base: LegalDoc = {
    eyebrow: typeof c.eyebrow === "string" ? c.eyebrow : fallback.eyebrow,
    title: Array.isArray(c.title)
      ? c.title.filter((line): line is string => typeof line === "string")
      : fallback.title,
    description: typeof c.description === "string" ? c.description : fallback.description,
    image:
      typeof c.image === "string"
        ? c.image
        : c.image === null
          ? undefined
          : fallback.image,
    controller,
    sections: fallback.sections,
  };

  if (typeof c.body_html === "string" && c.body_html.trim()) {
    return { ...base, body_html: c.body_html };
  }

  if (Array.isArray(c.sections) && c.sections.length > 0) {
    return {
      ...base,
      sections: parseSections(c.sections, fallback.sections ?? []),
    };
  }

  return fallback;
}

function ControllerBlock({ controller }: { controller: LegalController }) {
  return (
    <address className="mt-6 not-italic border-l border-ink/15 pl-5 text-sm leading-relaxed text-muted-ink md:pl-6">
      <p className="font-medium text-ink">{controller.name}</p>
      {controller.lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p className="mt-3">
        T:{" "}
        <a href={controller.phoneHref} className="transition-colors hover:text-ink">
          {controller.phone}
        </a>
      </p>
      <p>
        E:{" "}
        <a href={`mailto:${controller.email}`} className="transition-colors hover:text-ink">
          {controller.email}
        </a>
      </p>
      <p>
        W:{" "}
        <a
          href={controller.webHref}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-ink"
        >
          {controller.web}
        </a>
      </p>
    </address>
  );
}

function SectionBody({ section }: { section: LegalSection }) {
  return (
    <div className="mt-4 space-y-4">
      {section.paragraphs.map((para) => {
        if (!section.link || !para.includes(section.link.label)) {
          return (
            <p
              key={para.slice(0, 48)}
              className="text-sm leading-relaxed text-muted-ink md:text-[15px]"
            >
              {para}
            </p>
          );
        }

        const parts = para.split(section.link.label);
        return (
          <p
            key={para.slice(0, 48)}
            className="text-sm leading-relaxed text-muted-ink md:text-[15px]"
          >
            {parts.map((part, i) => (
              <span key={`${section.id}-${i}`}>
                {part}
                {i < parts.length - 1 ? (
                  <Link
                    to={section.link!.to}
                    className="underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/50"
                  >
                    {section.link!.label}
                  </Link>
                ) : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

const legalProseClass =
  "prose prose-sm max-w-none space-y-4 [&_h2]:font-display [&_h2]:text-[clamp(1.5rem,2.8vw,2rem)] [&_h2]:font-medium [&_h2]:uppercase [&_h2]:leading-[1.05] [&_h2]:[&_h2]:text-ink [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-medium [&_h3]:uppercase [&_h3]:[&_h3]:text-ink [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-ink [&_p]:md:text-[15px] [&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/25 [&_a]:underline-offset-4 [&_ul]:text-sm [&_ul]:text-muted-ink [&_ol]:text-sm [&_ol]:text-muted-ink";

export function LegalDocumentPage({ doc }: { doc: LegalDoc }) {
  const bodyHtml = doc.body_html?.trim();
  const sections = doc.sections ?? [];

  return (
    <PageShell headerVariant={doc.image ? "overlay" : "solid"}>
      <PageHero
        eyebrow={doc.eyebrow}
        title={doc.title}
        description={doc.description}
        image={doc.image}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[720px] space-y-14 px-5 md:px-10 md:space-y-16">
          {bodyHtml ? (
            <>
              <Reveal>
                <article
                  className={legalProseClass}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </Reveal>
              <Reveal delay={0.08}>
                <ControllerBlock controller={doc.controller} />
              </Reveal>
            </>
          ) : (
            sections.map((section, i) => (
              <Reveal key={section.id} delay={Math.min(i * 0.04, 0.2)}>
                <article id={section.id}>
                  <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] font-medium uppercase leading-[1.05] text-ink">
                    {section.title}
                  </h2>
                  <SectionBody section={section} />
                  {section.showAddress ? <ControllerBlock controller={doc.controller} /> : null}
                </article>
              </Reveal>
            ))
          )}
        </div>
      </section>
    </PageShell>
  );
}
