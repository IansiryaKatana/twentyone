import { motion, useInView } from "motion/react";
import * as React from "react";
import { newHome } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
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
    <span ref={ref} className="block overflow-hidden leading-[0.8]">
      <motion.span
        className={cn("block leading-[0.8]", className)}
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

      <div className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center md:px-10">
        <div className="flex w-full flex-col items-center">
          <h1 className="font-display nh-hero-title w-full pb-0 text-[clamp(3.12rem,calc(1.32rem+6.96vw),8.7rem)] font-medium leading-[0.8] text-[var(--nh-white)] lg:text-[clamp(3.9rem,calc(1.65rem+8.7vw),10.875rem)] xl:text-[clamp(6.375rem,10.8vw,10.875rem)]">
            {hero.titleLines.map((line, i) => (
              <MaskedLine key={i} delay={reduced ? 0 : 0.5 + i * 0.12} className="whitespace-normal md:whitespace-nowrap">
                {line.before}
                <span className="text-[var(--nh-red)]">{line.accent}</span>
              </MaskedLine>
            ))}
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1 }}
            className="mt-4 w-full max-w-none md:mt-5"
          >
            <p className="font-detective whitespace-pre-line text-[clamp(1.05rem,4.2vw,1.35rem)] font-medium leading-[1.25] normal-case text-white/75 md:whitespace-nowrap md:text-[clamp(1.35rem,2vw,1.75rem)] md:leading-[1.15]">
              {hero.description}
            </p>
            <p className="mt-2 max-w-full text-center text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] text-white/55 md:text-[11px] md:tracking-[0.22em] xl:text-xs">
              {hero.sectors}
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 1.15 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3.5 md:mt-6 md:gap-5"
          >
            <BrandButton to={hero.ctas[0].to}>{hero.ctas[0].label}</BrandButton>
          </motion.div>
        </div>
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
              <span className="mx-2 text-white/25">·</span>
              {item.label}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
