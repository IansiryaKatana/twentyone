import { motion, useInView } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { newHome } from "@/data/content";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { useCmsContent } from "@/hooks/useCmsContent";
import { cn } from "@/lib/utils";

function MaskedLine({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <span ref={ref} className="block overflow-hidden">
      <motion.span
        className={cn("block", className)}
        initial={{ y: "115%" }}
        animate={inView ? { y: "0%" } : { y: "115%" }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function NhHero() {
  const { hero } = newHome;
  const reduced = useReducedMotionSafe();
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.newHomeHero;

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[var(--nh-black)]"
    >
      <div className="absolute inset-0">
        <ResponsiveBgImage
          bg={bg}
          alt="Twentyone06 creative studio atmosphere"
          fetchPriority="high"
          imgClassName={cn(
            "object-[72%_35%] sm:object-[65%_35%] lg:object-[58%_35%] xl:object-[center_35%]",
            !reduced && "animate-kenburns",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 text-center md:px-10">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          className="mb-2 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--nh-red)] md:mb-3 md:text-xs"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="font-display w-full text-[clamp(3.12rem,calc(1.32rem+6.96vw),8.7rem)] font-medium leading-[0.95] text-[var(--nh-white)] xl:text-[clamp(5.1rem,8.64vw,8.7rem)]">
          {hero.titleLines.map((line, i) => (
            <MaskedLine key={i} delay={reduced ? 0 : 0.5 + i * 0.12} className="whitespace-nowrap">
              {line.before}
              <span className="text-[var(--nh-red)]">{line.accent}</span>
            </MaskedLine>
          ))}
        </h1>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1 }}
          className="mt-4 max-w-md md:mt-5 md:max-w-lg"
        >
          <p className="text-sm leading-relaxed text-white/75 md:text-base">
            {hero.description}
          </p>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 md:text-[11px] xl:text-xs">
            {hero.sectors}
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1.15 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-3.5 md:mt-6 md:gap-5"
        >
          <Link
            to={hero.ctas[0].to}
            className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[var(--nh-white)] md:text-sm"
          >
            {hero.ctas[0].label}
            <span className="flex size-9 items-center justify-center rounded-md border border-white/40 text-white transition-all duration-300 group-hover:border-[var(--nh-red)] group-hover:bg-[var(--nh-red)] md:size-10">
              <ArrowRight className="size-3.5 -rotate-45 md:size-4" />
            </span>
          </Link>

          <Link
            to={hero.ctas[1].to}
            className="group inline-flex items-center gap-2 rounded-md bg-[var(--nh-red)] py-2 pl-4 pr-2 text-xs uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:scale-[1.02] md:py-2.5 md:pl-5 md:pr-2.5 md:text-sm"
          >
            {hero.ctas[1].label}
            <span className="flex size-8 items-center justify-center rounded-md bg-white text-[var(--nh-red)] md:size-9">
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 md:size-4" />
            </span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.3, duration: 1, ease: EASE }}
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 xl:block 2xl:right-8"
      >
        <ul className="flex flex-col gap-8">
          {hero.rail.map((item) => (
            <li
              key={item.label}
              className="origin-right rotate-180 text-[10px] uppercase tracking-[0.28em] text-white/55 [writing-mode:vertical-rl]"
            >
              <span className="font-bold text-[var(--nh-red)]">{item.value}</span>
              <span className="mx-2 text-white/25">—</span>
              {item.label}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.4, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 hidden md:block"
      >
        <div className="flex h-14 w-8 items-start justify-center rounded-full border border-white/35 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-[var(--nh-red)]"
            animate={reduced ? undefined : { y: [0, 18, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
