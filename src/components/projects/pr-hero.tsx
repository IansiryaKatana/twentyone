import { motion, useInView } from "motion/react";
import * as React from "react";
import { projectsPage } from "@/data/content";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { useCmsContent } from "@/hooks/useCmsContent";
import { cn } from "@/lib/utils";

function FittedMaskedLine({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const maskRef = React.useRef<HTMLSpanElement | null>(null);
  const textRef = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(maskRef, { once: true, amount: 0.4 });
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const mask = maskRef.current;
    const text = textRef.current;
    if (!mask || !text) return;

    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(min-width: 768px)").matches) {
          setScale(1);
          return;
        }
        const target = mask.clientWidth;
        const natural = text.scrollWidth;
        if (target <= 0 || natural <= 0) return;
        const next = target / natural;
        setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
      });
    };

    fit();
    void document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit);
    const observer = new ResizeObserver(fit);
    observer.observe(mask);
    window.addEventListener("resize", fit);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", fit);
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, [children]);

  return (
    <span
      ref={maskRef}
      className="block overflow-hidden"
      style={scale === 1 ? undefined : { height: `${scale * 0.95}em` }}
    >
      <motion.span
        className="block"
        initial={{ y: "115%" }}
        animate={inView ? { y: "0%" } : { y: "115%" }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        <span
          ref={textRef}
          className={cn(
            "inline-block origin-top whitespace-nowrap will-change-transform",
            className,
          )}
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </span>
      </motion.span>
    </span>
  );
}

export function PrHero() {
  const { hero } = projectsPage;
  const reduced = useReducedMotionSafe();
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.projects;

  return (
    <section className="sticky top-0 z-0 flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-[var(--nh-black)]">
      <div className="absolute inset-0">
        <ResponsiveBgImage
          bg={bg}
          fetchPriority="high"
          imgClassName={cn(
            "object-center",
            !reduced && "animate-kenburns",
          )}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-5 text-center md:px-10">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: reduced ? 0 : 0.25 }}
          className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-[var(--nh-red)]"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="font-display w-full text-[clamp(3.12rem,calc(1.32rem+6.96vw),8.7rem)] font-medium leading-[0.95] text-[var(--nh-white)] lg:text-[clamp(3.9rem,calc(1.65rem+8.7vw),10.875rem)] xl:text-[clamp(6.375rem,10.8vw,10.875rem)]">
          {hero.titleLines.map((line, i) => (
            <FittedMaskedLine
              key={line.text}
              delay={reduced ? 0 : 0.35 + i * 0.12}
              className={line.accent ? "text-[var(--nh-red)]" : undefined}
            >
              {line.text}
            </FittedMaskedLine>
          ))}
        </h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.85 }}
          className="font-detective mx-auto mt-7 max-w-3xl text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-[1.15] text-white/70 md:mt-9"
        >
          {hero.description}
        </motion.p>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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
