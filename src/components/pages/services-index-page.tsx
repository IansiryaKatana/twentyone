import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { servicesPage, type Project } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { InquiryForm } from "@/components/inquiry-form";
import { ServiceProjectCarousel } from "@/components/services/service-project-carousel";
import { useCmsContent } from "@/hooks/useCmsContent";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

type Section = (typeof servicesPage.sections)[number];

function ServiceCta({ section }: { section: Section }) {
  const classes =
    "group inline-flex items-center gap-2 rounded-md bg-black py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-crimson";
  const icon = (
    <span className="flex size-8 items-center justify-center rounded-md bg-cream text-ink transition-transform duration-300 group-hover:rotate-45">
      <ArrowUpRight className="size-4" />
    </span>
  );

  if ("ctaHref" in section && section.ctaHref) {
    return (
      <a href={section.ctaHref} className={classes}>
        {section.cta}
        {icon}
      </a>
    );
  }

  const search =
    "ctaSearch" in section && section.ctaSearch
      ? section.ctaSearch
      : undefined;

  return (
    <Link to="/projects" search={search} className={classes}>
      {section.cta}
      {icon}
    </Link>
  );
}

function ServicesHero() {
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.services;

  return (
    <section className="relative min-h-[85svh] overflow-hidden bg-[var(--nh-black)] pt-28 md:min-h-[90svh] md:pt-32">
      <ResponsiveBgImage bg={bg} />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        aria-hidden
      />

      <div className="relative z-10 grid min-h-[calc(85svh-7rem)] w-full grid-cols-1 items-end gap-12 px-5 pb-14 md:min-h-[calc(90svh-8rem)] md:grid-cols-12 md:px-10 md:pb-20">
        <div className="md:col-span-7 lg:col-span-8">
          <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/65">
            <span className="h-px w-10 bg-white/35" />
            {servicesPage.eyebrow}
          </p>
          <LinesReveal
            as="h1"
            lines={[...servicesPage.title]}
            className="font-display max-w-3xl text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[1.04] text-white"
          />
          <Reveal delay={0.2} className="mt-6 max-w-xl">
            <p className="text-sm leading-relaxed text-white/75 md:text-base">
              {servicesPage.description}
            </p>
          </Reveal>
        </div>

        <nav
          aria-label="Services"
          className="flex flex-col gap-1 border-t border-white/20 pt-6 md:col-span-5 md:border-t-0 md:border-l md:pl-8 md:pt-0 lg:col-span-4 lg:pl-10"
        >
          {servicesPage.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-baseline gap-4 py-3 text-white transition-colors hover:text-[var(--nh-red)] md:py-3.5"
            >
              <span className="text-[11px] tabular-nums tracking-[0.18em] text-white/45 group-hover:text-[var(--nh-red)]">
                {section.index}
              </span>
              <span className="font-display text-[clamp(1.35rem,2.6vw,2.35rem)] font-semibold uppercase leading-[1.02]">
                {section.tabLabel}
                <ArrowUpRight className="ml-2 inline-block size-[0.45em] shrink-0 text-[var(--nh-red)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function ServiceSection({
  section,
  reverse,
  stackIndex,
  projects,
}: {
  section: Section;
  reverse: boolean;
  stackIndex: number;
  projects: Project[];
}) {
  const serviceProjects = projects.filter((project) =>
    project.services.includes(
      section.id as Project["services"][number],
    ),
  );

  return (
    <section
      id={section.id}
      style={{ zIndex: stackIndex }}
      className={cn(
        "scroll-mt-24 py-20",
        reverse ? "bg-cream-2" : "bg-cream",
        // Sticky stack: each panel pins at 100vh on desktop and is covered by the next
        "md:sticky md:top-0 md:h-[100vh] md:overflow-hidden md:py-0"
      )}
    >
      <div className="grid h-full w-full grid-cols-1 items-center gap-10 px-5 md:grid-cols-12 md:gap-0 md:px-0">
        <div
          className={cn(
            "md:col-span-6 md:h-full",
            reverse ? "md:order-2" : "md:order-1"
          )}
        >
          <Reveal className="h-full">
            <ServiceProjectCarousel
              projects={serviceProjects}
              fallbackImage={section.image}
              fallbackAlt={section.title}
            />
          </Reveal>
        </div>

        <div
          className={cn(
            "flex flex-col justify-center md:col-span-6 md:h-full md:overflow-y-auto md:px-10 md:py-12 lg:px-14 lg:py-14",
            reverse ? "md:order-1" : "md:order-2"
          )}
        >
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-ink">
              <span className="mr-3 tabular-nums text-crimson">
                {section.index}
              </span>
              {section.serviceLabel}
            </p>
            <h2 className="font-display mt-3 text-[clamp(2rem,4.2vw,3.75rem)] font-semibold uppercase leading-[1.02] text-ink md:mt-4">
              {section.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-5 max-w-xl space-y-3 md:mt-6 md:space-y-3.5">
            {section.body.map((para) => (
              <p
                key={para}
                className="text-sm leading-relaxed text-muted-ink md:text-[0.925rem]"
              >
                {para}
              </p>
            ))}
          </Reveal>

          <Stagger stagger={0.05} className="mt-6 space-y-2 md:mt-7">
            {section.bullets.map((bullet) => (
              <StaggerItem key={bullet}>
                <div className="flex gap-3 text-sm text-ink">
                  <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-crimson" />
                  <span className="leading-relaxed">{bullet}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-8 md:mt-9">
            <ServiceCta section={section} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesContact() {
  const { contact } = servicesPage;
  return (
    <section id="lets-talk" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10 lg:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[1.02] text-ink">
              {contact.title}
            </h2>
            <p className="mt-5 text-sm uppercase tracking-[0.22em] text-muted-ink">
              {contact.eyebrow}
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-ink">
              {contact.body}
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-7">
          <Reveal delay={0.1}>
            <InquiryForm submitFullWidth />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ServicesIndexPage() {
  const cms = useCmsContent();

  return (
    <PageShell headerVariant="overlay">
      <ServicesHero />
      {/* Sticky stack: each service pins at 100vh; next slides over; contact releases */}
      <div className="relative">
        {servicesPage.sections.map((section, i) => (
          <ServiceSection
            key={section.id}
            section={section}
            reverse={i % 2 === 1}
            stackIndex={i + 1}
            projects={cms.projects}
          />
        ))}
      </div>
      <div className="relative z-20">
        <ServicesContact />
      </div>
    </PageShell>
  );
}
