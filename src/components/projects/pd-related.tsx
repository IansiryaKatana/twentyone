import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/content";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";

export function PdRelated({
  next,
  related,
}: {
  next: Project | null;
  related: Project[];
}) {
  const others = related.filter((p) => p.slug !== next?.slug).slice(0, 3);

  return (
    <section className="border-t border-[var(--nh-line)] bg-[var(--nh-black)]">
      {next && (
        <Link
          to="/projects/$slug"
          params={{ slug: next.slug }}
          className="group relative block overflow-hidden"
        >
          <div className="relative aspect-[16/10] w-full md:aspect-[21/8]">
            <motion.img
              src={next.hero}
              alt={next.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/55 transition-colors duration-500 group-hover:bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end px-5 py-10 md:px-10 md:py-14 lg:px-[7vw]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
              Next project
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display max-w-3xl text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[0.9] tracking-tighter text-[var(--nh-white)]">
                {next.title}
              </h2>
              <span className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-[var(--nh-white)]">
                View
                <span className="flex size-10 items-center justify-center rounded-full border border-white/40 transition-colors duration-300 group-hover:border-[var(--nh-red)] group-hover:bg-[var(--nh-red)]">
                  <ArrowRight className="size-4" />
                </span>
              </span>
            </div>
            <p className="mt-3 text-sm text-white/55">
              {next.location} · {next.year}
            </p>
          </div>
        </Link>
      )}

      {others.length > 0 && (
        <div className="px-5 py-14 md:px-10 md:py-20 lg:px-[7vw]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
                  More work
                </p>
              </Reveal>
              <LinesReveal
                as="h2"
                lines={["Related Projects"]}
                className="font-display mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[0.92] tracking-tighter text-[var(--nh-white)]"
                delay={0.08}
              />
            </div>
            <Link
              to="/projects"
              className="hidden text-xs uppercase tracking-[0.28em] text-[var(--nh-muted)] transition-colors hover:text-[var(--nh-white)] sm:inline"
            >
              View all
            </Link>
          </div>

          <Stagger stagger={0.1} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {others.map((p) => (
              <StaggerItem key={p.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group block"
                >
                  <div className="overflow-hidden">
                    <motion.img
                      src={p.hero}
                      alt={p.title}
                      className="aspect-[4/3] w-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-medium uppercase leading-tight tracking-tight text-[var(--nh-white)] transition-colors group-hover:text-[var(--nh-red)] md:text-xl">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-[var(--nh-muted)]">
                    {p.category} · {p.year}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </section>
  );
}
