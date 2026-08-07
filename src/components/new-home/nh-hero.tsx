import { motion, useInView } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { newHome } from "@/data/content";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { cn } from "@/lib/utils";
import heroSilhouettes from "@/Assets/silhouettes-no-face.png";

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
    <span ref={ref} className="block overflow-hidden pb-[0.12em]">
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

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[var(--nh-black)]"
    >
      <div className="absolute inset-0">
        <img
          src={heroSilhouettes}
          alt="Twentyone06 creative studio atmosphere"
          className={cn(
            "h-full w-full object-cover object-[72%_35%] sm:object-[65%_35%] lg:object-[58%_35%] xl:object-[center_35%]",
            !reduced && "animate-kenburns"
          )}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent md:from-black/60 md:via-black/20 xl:from-black/55 xl:via-black/15" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-end px-5 pb-14 md:px-10 md:pb-16 lg:max-w-[58%] lg:pb-20 xl:max-w-[54%] xl:pb-20 2xl:max-w-none 2xl:pr-[min(42vw,36rem)]">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--nh-red)] md:mb-5 md:text-xs"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="font-display w-full text-[clamp(2.6rem,calc(1.1rem+5.8vw),7.25rem)] font-medium leading-[0.9] tracking-tighter text-[var(--nh-white)] xl:text-[clamp(4.25rem,7.2vw,7.25rem)]">
          {hero.titleLines.map((line, i) => (
            <MaskedLine key={i} delay={reduced ? 0 : 0.5 + i * 0.12}>
              {line.before}
              <span className="text-[var(--nh-red)]">{line.accent}</span>
            </MaskedLine>
          ))}
        </h1>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1 }}
          className="mt-5 max-w-md md:mt-7 md:max-w-lg xl:max-w-xl"
        >
          <p className="text-sm leading-relaxed text-white/75 md:text-base">
            {hero.description}
          </p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 md:text-[11px] xl:text-xs">
            {hero.sectors}
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1.15 }}
          className="mt-7 flex flex-wrap items-center gap-3.5 md:mt-9 md:gap-5"
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
