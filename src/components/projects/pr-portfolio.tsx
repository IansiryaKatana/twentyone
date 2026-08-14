import * as React from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, X } from "lucide-react";
import {
  getProjectSector,
  projectsPage,
  type Project,
} from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import { cn } from "@/lib/utils";

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

type FilterKey = keyof typeof projectsPage.filterGroups;
type FilterState = Record<FilterKey, string>;
type FilterOption = { value: string; label: string };

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
          <h3 className="font-display mt-1.5 text-[clamp(1.35rem,2.5vw,2rem)] font-medium leading-[1.05] text-[var(--nh-white)] transition-colors duration-300 group-hover:text-[var(--nh-red)]">
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

function FilterDropdown({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly FilterOption[];
  onChange: (value: string) => void;
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value) ?? options[0];
  const isActive = value !== "All";

  React.useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.28em] text-white/80"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        className={cn(
          "group mt-2 flex w-full items-center justify-between gap-3 border-b py-3 text-left outline-none transition-colors",
          open
            ? "border-[var(--nh-red)]"
            : isActive
              ? "border-white/55 hover:border-white/80"
              : "border-white/35 hover:border-white/55",
          "focus-visible:border-[var(--nh-red)]"
        )}
      >
        <span
          className={cn(
            "truncate text-sm tracking-wide",
            isActive ? "text-[var(--nh-white)]" : "text-white/90"
          )}
        >
          {selected?.label ?? "All"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-white/70 transition-transform duration-300 group-hover:text-white",
            open && "rotate-180 text-[var(--nh-red)]"
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.97 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute inset-x-0 top-full z-40 mt-2 origin-top overflow-hidden rounded-md border border-white/15 bg-[#0b0b0b] p-1.5 shadow-xl shadow-black/50"
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-sm px-3.5 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-[var(--nh-red)] text-white"
                        : "text-white/85 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    <span>{option.label}</span>
                    {active ? <Check className="size-3.5 shrink-0" /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function matchesFilters(project: Project, filters: FilterState) {
  if (filters.service !== "All") {
    const slug = filters.service as Project["services"][number];
    if (!project.services?.includes(slug)) return false;
  }

  if (filters.sector !== "All") {
    if (getProjectSector(project) !== filters.sector) return false;
  }

  if (filters.year !== "All" && project.year !== filters.year) return false;

  if (filters.location !== "All") {
    if (
      !project.location
        .toLowerCase()
        .includes(filters.location.toLowerCase())
    ) {
      return false;
    }
  }

  return true;
}

export function PrProjectGrid({
  initialService,
  idPrefix = "filter",
}: {
  initialService?: string;
  idPrefix?: string;
}) {
  const { filterGroups } = projectsPage;
  const { projects } = useCmsContent();
  const filtersId = `${idPrefix}-project-filters`;

  const serviceFromUrl =
    initialService && SERVICE_FROM_URL[initialService]
      ? SERVICE_FROM_URL[initialService]
      : "All";

  const [filters, setFilters] = React.useState<FilterState>(() => ({
    service: serviceFromUrl,
    sector: "All",
    year: "All",
    location: "All",
  }));
  const [filtersExpanded, setFiltersExpanded] = React.useState(
    () => serviceFromUrl !== "All",
  );

  React.useEffect(() => {
    const next =
      initialService && SERVICE_FROM_URL[initialService]
        ? SERVICE_FROM_URL[initialService]
        : "All";
    setFilters((prev) =>
      prev.service === next ? prev : { ...prev, service: next },
    );
    if (next !== "All") setFiltersExpanded(true);
  }, [initialService]);

  const setFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = projects.filter((p) => matchesFilters(p, filters));
  const hasActive =
    filters.service !== "All" ||
    filters.sector !== "All" ||
    filters.year !== "All" ||
    filters.location !== "All";

  const clearAll = () => {
    setFilters({
      service: "All",
      sector: "All",
      year: "All",
      location: "All",
    });
  };

  return (
    <>
      <Reveal delay={0.1} className="mt-10 md:mt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <button
            type="button"
            onClick={() => setFiltersExpanded((open) => !open)}
            aria-expanded={filtersExpanded}
            aria-controls={filtersId}
            className="inline-flex items-center gap-2 self-start text-[10px] uppercase tracking-[0.28em] text-white/85 transition-colors hover:text-white md:pointer-events-none md:cursor-default"
          >
            Refine the work
            <ChevronDown
              className={cn(
                "size-3.5 text-white/70 transition-transform duration-300 md:hidden",
                filtersExpanded && "rotate-180"
              )}
            />
          </button>
          {hasActive ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 self-start text-[10px] uppercase tracking-[0.22em] text-[var(--nh-red)] transition-colors hover:text-white sm:self-auto"
            >
              <X className="size-3" />
              Clear filters
            </button>
          ) : null}
        </div>

        <div
          id={filtersId}
          className={cn(
            "mt-5 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-white/20 pt-6 sm:grid-cols-2 lg:grid-cols-4",
            filtersExpanded ? "grid" : "hidden",
            "md:grid"
          )}
        >
          {(Object.keys(filterGroups) as FilterKey[]).map((key) => (
            <FilterDropdown
              key={key}
              id={`${idPrefix}-${key}`}
              label={filterGroups[key].label}
              value={filters[key]}
              options={filterGroups[key].options}
              onChange={(value) => setFilter(key, value)}
            />
          ))}
        </div>
      </Reveal>

      <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-white/70">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>

      <div className="mt-6 columns-1 gap-4 md:columns-2 md:gap-5 xl:columns-3">
        {filtered.map((project) => (
          <ProjectTile key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-sm text-white/50">
          No projects match these filters yet.{" "}
          <button
            type="button"
            onClick={clearAll}
            className="text-[var(--nh-red)] underline"
          >
            Clear filters
          </button>
          .
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
