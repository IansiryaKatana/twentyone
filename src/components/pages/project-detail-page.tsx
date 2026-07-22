import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MapPin, ArrowLeft } from "lucide-react";
import {
  getProject,
  getRelatedProjects,
  type Project,
} from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PillCta } from "@/components/page-hero";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const project = getProject(slug);

  if (!project) {
    return (
      <PageShell>
        <section className="bg-cream px-5 pb-28 pt-28 sm:pt-36 md:px-10">
          <div className="mx-auto max-w-[1440px]">
            <h1 className="font-display text-4xl uppercase text-ink">
              Project not found
            </h1>
            <Link
              to="/projects"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-ink hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const related = getRelatedProjects(project.slug);
  const facts = [
    { label: "Year", value: project.year },
    { label: "Client", value: project.client },
    { label: "Area", value: project.area },
    { label: "Status", value: project.status },
    { label: "Duration", value: project.duration },
    { label: "Category", value: project.category },
  ];

  return (
    <PageShell>
      {/* Full-bleed hero — flush under fixed header */}
      <section className="bg-cream pt-16 sm:pt-20">
        <Reveal>
          <img
            src={project.hero}
            alt={project.title}
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
          />
        </Reveal>
      </section>

      {/* Meta + body */}
      <section className="bg-cream py-14 md:py-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-ink">
              {project.category} · {project.year}
            </p>
            <LinesReveal
              as="h1"
              lines={[project.title]}
              className="font-display mt-4 text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1] text-ink"
            />
            <Reveal delay={0.15} className="mt-4">
              <p className="flex items-center gap-1.5 text-sm text-muted-ink">
                <MapPin className="size-3.5" />
                {project.location}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 space-y-8">
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted-ink">
                  Challenge
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted-ink">
                  Approach
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">
                  {project.approach}
                </p>
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-muted-ink">
                  Outcome
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">
                  {project.outcome}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="mt-10 space-y-4">
              {project.body.map((para) => (
                <p key={para} className="max-w-xl text-sm leading-relaxed text-muted-ink">
                  {para}
                </p>
              ))}
            </Reveal>
          </div>

          <div className="md:col-span-5 md:pt-2">
            <Reveal delay={0.1} className="rounded-lg border border-line bg-cream-2 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-ink">
                Investment
              </p>
              <p className="font-display mt-3 text-3xl text-ink">{project.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-ink">
                {project.excerpt}
              </p>

              <dl className="mt-8 space-y-3 border-t border-line/70 pt-6">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <dt className="text-muted-ink">{f.label}</dt>
                    <dd className="text-right text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <PillCta to="/contact" className="mt-8">
                Inquire About This Project
              </PillCta>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scope / materials */}
      <section className="bg-cream-2 py-14 md:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 md:grid-cols-3 md:px-10">
          <Reveal>
            <h3 className="text-xs uppercase tracking-[0.25em] text-muted-ink">
              Scope of Work
            </h3>
            <ul className="mt-4 space-y-2">
              {project.scope.map((item) => (
                <li key={item} className="text-sm text-ink/85">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-xs uppercase tracking-[0.25em] text-muted-ink">
              Materials
            </h3>
            <ul className="mt-4 space-y-2">
              {project.materials.map((item) => (
                <li key={item} className="text-sm text-ink/85">
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-ink">
              Finishes
            </h3>
            <ul className="mt-4 space-y-2">
              {project.finishes.map((item) => (
                <li key={item} className="text-sm text-ink/85">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.12}>
            <h3 className="text-xs uppercase tracking-[0.25em] text-muted-ink">
              Typologies
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.typologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-3 py-1 text-xs text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-ink">
              Credits
            </h3>
            <ul className="mt-4 space-y-3">
              {project.credits.map((c) => (
                <li key={c.role} className="text-sm">
                  <span className="text-muted-ink">{c.role}</span>
                  <span className="mt-0.5 block text-ink">{c.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Gallery — dual full-width marquees */}
      <section className="overflow-hidden bg-cream py-6 md:py-8">
        <GalleryMarquee project={project} />
      </section>

      {related.length > 0 && (
        <section className="bg-cream-2 py-14 md:py-24">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl font-normal uppercase text-ink md:text-4xl">
                Related Projects
              </h2>
              <Link
                to="/projects"
                className="text-xs uppercase tracking-[0.25em] text-muted-ink transition-colors hover:text-ink"
              >
                View all
              </Link>
            </div>
            <Stagger stagger={0.12} className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.slug} project={p} />
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </PageShell>
  );
}

function GalleryMarquee({ project }: { project: Project }) {
  const items = project.gallery.map((src, i) => ({
    src,
    title:
      project.typologies[i % project.typologies.length] ??
      `${project.title} · ${String(i + 1).padStart(2, "0")}`,
    description:
      project.scope[i % project.scope.length] ?? project.excerpt,
  }));

  // Ensure enough tiles for a seamless loop on wide screens
  const base = items.length < 4 ? [...items, ...items] : items;
  const rowA = base.filter((_, i) => i % 2 === 0);
  const rowB = base.filter((_, i) => i % 2 === 1);
  const loopA = [...rowA, ...rowA];
  const loopB = [...rowB, ...rowB];

  return (
    <div className="flex w-full flex-col gap-0">
      {/* Row 1 — marquee right */}
      <div className="gallery-marquee-row relative w-full overflow-hidden">
        <div className="marquee-track-reverse gap-0">
          {loopA.map((item, i) => (
            <GalleryTile
              key={`a-${item.src}-${i}`}
              src={item.src}
              title={item.title}
              description={item.description}
              alt={`${project.title} — ${item.title}`}
            />
          ))}
        </div>
      </div>

      {/* Row 2 — marquee left */}
      <div className="gallery-marquee-row relative w-full overflow-hidden">
        <div className="marquee-track gap-0">
          {loopB.map((item, i) => (
            <GalleryTile
              key={`b-${item.src}-${i}`}
              src={item.src}
              title={item.title}
              description={item.description}
              alt={`${project.title} — ${item.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryTile({
  src,
  title,
  description,
  alt,
}: {
  src: string;
  title: string;
  description: string;
  alt: string;
}) {
  return (
    <div className="group relative h-64 w-[min(85vw,420px)] shrink-0 overflow-hidden sm:h-80 sm:w-[520px] md:h-[28rem] md:w-[640px] lg:h-[32rem] lg:w-[720px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent px-5 pb-5 pt-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:px-6 md:pb-6">
        <p className="font-display text-base uppercase leading-tight text-cream md:text-xl">
          {title}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-cream/75 md:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function RelatedCard({ project }: { project: Project }) {
  return (
    <StaggerItem className="group">
      <Link to="/projects/$slug" params={{ slug: project.slug }} className="block">
        <div className="overflow-hidden rounded-md">
          <motion.img
            src={project.hero}
            alt={project.title}
            className="aspect-[4/3] w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </div>
        <h3 className="font-display mt-4 text-lg text-ink group-hover:text-clay">
          {project.title}
        </h3>
        <p className="mt-1 text-xs text-muted-ink">{project.location}</p>
      </Link>
    </StaggerItem>
  );
}
