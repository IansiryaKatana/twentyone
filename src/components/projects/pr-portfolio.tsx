import * as React from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  getProjectSector,
  projectsPage,
  type Project,
} from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { BrandButton } from "@/components/brand-button";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

const SERVICE_FROM_URL: Record<string, string> = {
  "interior-design": "interior-design",
  branding: "branding",
  "design-management": "design-management",
};

const SERVICE_LABELS: Record<Project["services"][number], string> = {
  "interior-design": "Interior Design",
  branding: "Branding",
  "design-management": "Design Management",
  "design-strategy": "Design Strategy",
};

const aspectClass: Record<Project["span"], string> = {
  tall: "aspect-[4/5]",
  short: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

function ProjectTile({ project }: { project: Project }) {
  const reduced = useReducedMotionSafe();
  const sector = getProjectSector(project);
  const serviceLabel =
    (project.services[0] && SERVICE_LABELS[project.services[0]]) ||
    project.category;
  const place =
    project.location.split(",")[0]?.trim() || project.location;
  const meta = [sector, place, project.year].filter(Boolean).join(" · ");

  return (
    <div className="mb-4 break-inside-avoid md:mb-5">
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="group relative block overflow-hidden bg-[var(--nh-panel)]"
      >
        <motion.img
          src={project.hero}
          alt={project.title}
          className={cn(
            "w-full object-cover",
            aspectClass[project.span] ?? aspectClass.short
          )}
          whileHover={reduced ? undefined : { scale: 1.06 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 md:p-6">
          <p className="text-xs font-medium tracking-wide text-[var(--nh-white)] md:text-[13px]">
            {serviceLabel}
          </p>
          <h3 className="font-display mt-1.5 text-[2.275rem] font-medium uppercase leading-[1.05] text-[var(--nh-white)] transition-colors duration-300 group-hover:text-[var(--nh-red)] md:text-[clamp(1.75rem,3.5vw,2.8125rem)]">
            {project.title}
          </h3>
          <p className="mt-2 text-[11px] tracking-wide text-white/55 md:text-xs">
            {meta}
          </p>
        </div>
      </Link>
    </div>
  );
}

function matchesService(project: Project, service: string) {
  if (service === "All") return true;
  return project.services?.includes(service as Project["services"][number]);
}

export function PrProjectGrid({
  initialService,
}: {
  initialService?: string;
  idPrefix?: string;
}) {
  const { projects } = useCmsContent();

  const serviceFromUrl =
    initialService && SERVICE_FROM_URL[initialService]
      ? SERVICE_FROM_URL[initialService]
      : "All";

  const [service, setService] = React.useState(serviceFromUrl);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  React.useEffect(() => {
    const next =
      initialService && SERVICE_FROM_URL[initialService]
        ? SERVICE_FROM_URL[initialService]
        : "All";
    setService(next);
    setVisibleCount(PAGE_SIZE);
  }, [initialService]);

  const filtered = projects.filter((p) => matchesService(p, service));
  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const isExpanded = visibleCount > PAGE_SIZE && filtered.length > PAGE_SIZE;

  return (
    <>
      <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-white/70 md:mt-10">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      <div className="mt-6 columns-1 gap-4 md:columns-2 md:gap-5 xl:columns-3">
        {visibleProjects.map((project) => (
          <ProjectTile key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length > PAGE_SIZE ? (
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {hasMore ? (
            <BrandButton
              type="button"
              icon="down"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + PAGE_SIZE, filtered.length),
                )
              }
            >
              Show more
            </BrandButton>
          ) : null}
          {isExpanded ? (
            <BrandButton
              type="button"
              variant="outline-light"
              icon="up"
              onClick={() => setVisibleCount(PAGE_SIZE)}
            >
              Show less
            </BrandButton>
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-12 text-sm text-white/50">
          No projects match this selection yet.
        </p>
      ) : null}
    </>
  );
}

export function PrPortfolio() {
  const { portfolio } = projectsPage;
  const { service: serviceParam } = useSearch({ from: "/projects/" });

  React.useEffect(() => {
    if (!serviceParam) return;

    let cancelled = false;
    const scrollToWork = () => {
      if (cancelled) return;
      document.getElementById("work")?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    };

    const frame = window.requestAnimationFrame(scrollToWork);
    const retry = window.setTimeout(scrollToWork, 80);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [serviceParam]);

  return (
    <section
      id="work"
      className="relative scroll-mt-24 bg-[var(--nh-black)] px-5 pb-24 pt-6 md:px-10 md:pb-32 lg:px-[7vw]"
    >
      <Reveal className="mb-8 flex justify-center md:mb-10">
        <NhSectionTitle title={portfolio.title} tone="dark" />
      </Reveal>

      <PrProjectGrid initialService={serviceParam} />
    </section>
  );
}
