import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { projects, projectsPage, type Project } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { EASE, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

const aspect: Record<string, string> = {
  tall: "aspect-[4/5]",
  short: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <StaggerItem className="group">
      <Link to="/projects/$slug" params={{ slug: project.slug }} className="block">
        <div className="overflow-hidden rounded-lg">
          <motion.img
            src={project.hero}
            alt={project.title}
            className={cn("w-full object-cover", aspect[project.span] ?? aspect.short)}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-ink">
              {project.category}
            </p>
            <h3 className="font-display mt-1 text-lg text-ink transition-colors group-hover:text-clay md:text-xl">
              {project.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs tracking-wide text-muted-ink">
              <MapPin className="size-3" />
              {project.location}
            </p>
          </div>
          <span className="whitespace-nowrap font-display text-base text-ink">
            {project.price}
          </span>
        </div>
      </Link>
    </StaggerItem>
  );
}

export function ProjectsPage() {
  const [filter, setFilter] = React.useState<(typeof projectsPage.filters)[number]>("All");
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const left = filtered.filter((_, i) => i % 2 === 0);
  const right = filtered.filter((_, i) => i % 2 === 1);

  return (
    <PageShell>
      <PageHero
        eyebrow={projectsPage.eyebrow}
        title={[...projectsPage.title]}
        description={projectsPage.description}
      />

      <section className="bg-cream pb-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-12 flex flex-wrap gap-2">
            {projectsPage.filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors",
                  filter === f
                    ? "border-ink bg-ink text-cream"
                    : "border-line text-muted-ink hover:border-ink hover:text-ink"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <Stagger stagger={0.12} className="flex flex-col gap-14">
              {left.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </Stagger>
            <Stagger
              stagger={0.12}
              delayChildren={0.08}
              className="mt-0 flex flex-col gap-14 md:mt-28"
            >
              {right.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
