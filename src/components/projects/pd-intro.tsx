import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/content";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";

function MaskedHeading({ title }: { title: string }) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotionSafe();
  const words = title.trim().split(/\s+/).filter(Boolean);
  const last = words.at(-1) ?? "";
  const lead = words.slice(0, -1).join(" ");

  return (
    <h1
      ref={ref}
      className="font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[1.02]"
    >
      <span className="block overflow-hidden">
        <motion.span
          className="block text-[var(--nh-white)]"
          initial={reduced ? false : { y: "115%" }}
          animate={inView || reduced ? { y: "0%" } : { y: "115%" }}
          transition={{
            duration: 0.95,
            ease: EASE,
            delay: reduced ? 0 : 0.12,
          }}
        >
          {lead ? `${lead} ` : null}
          <span className="text-[var(--nh-red)]">{last}</span>
        </motion.span>
      </span>
    </h1>
  );
}

export function PdIntro({ project }: { project: Project }) {
  const facts = [
    { label: "Category", value: project.category },
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Location", value: project.location },
    { label: "Status", value: project.status },
  ];

  return (
    <section className="bg-[var(--nh-black)] pt-28 md:pt-36">
      <div className="px-5 md:px-10 lg:px-[7vw]">
        <Reveal className="flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--nh-muted)] transition-colors hover:text-[var(--nh-white)]"
          >
            <ArrowLeft className="size-3.5" />
            All projects
          </Link>
        </Reveal>

        <div className="mx-auto mt-10 max-w-4xl text-center md:mt-14">
          <Reveal delay={0.05}>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
              {project.category} · {project.year}
            </p>
          </Reveal>

          <div className="mt-5 md:mt-7">
            <MaskedHeading title={project.title} />
          </div>

          <Reveal delay={0.28} className="mx-auto mt-7 max-w-xl md:mt-9">
            <p className="font-detective text-[1.3125rem] font-medium leading-[1.15] text-white/70 md:text-[1.3875rem]">
              {project.excerpt}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.35} className="mt-12 border-t border-[var(--nh-line)] md:mt-16">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:grid-cols-3 md:grid-cols-5 md:gap-8 md:py-10">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0 text-left sm:text-center md:text-left">
                <dt className="font-display text-[clamp(2rem,5vw,3.75rem)] font-medium uppercase leading-[0.92] text-[var(--nh-red)]">
                  {f.label}
                </dt>
                <dd className="font-detective mt-2 text-sm text-[var(--nh-white)] md:text-[15px]">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal y={40} amount={0.2} className="mt-2 md:mt-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] md:aspect-[21/9]">
          <motion.img
            src={project.hero}
            alt={project.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.45, ease: EASE }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>
      </Reveal>
    </section>
  );
}
