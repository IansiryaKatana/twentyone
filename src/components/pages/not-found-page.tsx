import { motion, useInView } from "motion/react";
import * as React from "react";
import { BrandButton } from "@/components/brand-button";
import { NhHeader } from "@/components/new-home/nh-header";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { cn } from "@/lib/utils";
import heroSilhouettes from "@/Assets/silhouettes-no-face.png";
import flyGraphic from "@/Assets/fly.png";

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

export function NotFoundPage() {
  const reduced = useReducedMotionSafe();

  return (
    <div className="new-home relative min-h-screen">
      <NhHeader />

      <main>
        <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-[var(--nh-black)] pt-28 pb-16 md:pb-20">
          <div className="absolute inset-0">
            <img
              src={heroSilhouettes}
              alt=""
              aria-hidden
              className={cn(
                "h-full w-full object-cover object-[center_35%] opacity-45",
                !reduced && "animate-kenburns"
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          </div>

          <img
            src={flyGraphic}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-[-4%] bottom-[8%] z-10 hidden w-[min(42vw,420px)] object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.55)] md:block"
          />

          <div className="relative z-20 w-full px-5 md:px-10">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--nh-red)] md:text-xs"
            >
              Error 404
            </motion.p>

            <h1 className="font-display text-[clamp(5.5rem,18vw,14rem)] font-medium leading-[0.82] tracking-tight text-[var(--nh-white)]">
              <MaskedLine delay={reduced ? 0 : 0.35}>
                4<span className="text-[var(--nh-red)]">0</span>4
              </MaskedLine>
            </h1>

            <h2 className="font-display mt-4 max-w-3xl text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[1.05] text-[var(--nh-white)] md:mt-6">
              <MaskedLine delay={reduced ? 0 : 0.5}>Page Not</MaskedLine>
              <MaskedLine delay={reduced ? 0 : 0.62}>
                <span className="text-[var(--nh-red)]">Found.</span>
              </MaskedLine>
            </h2>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                ease: EASE,
                delay: reduced ? 0 : 0.85,
              }}
              className="mt-7 max-w-md text-sm leading-relaxed text-white/70 md:text-base"
            >
              The page you&apos;re looking for has moved, been removed, or never
              existed. Let&apos;s get you back to the work that matters.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                ease: EASE,
                delay: reduced ? 0 : 1,
              }}
              className="mt-10 flex flex-wrap items-center gap-4 md:gap-5"
            >
              <BrandButton to="/">Back to Studio</BrandButton>
              <BrandButton to="/projects" variant="outline-light">
                View All Projects
              </BrandButton>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
