import * as React from "react";
import { motion, useInView } from "motion/react";
import { newHome } from "@/data/content";
import { EASE, Reveal } from "@/components/anim";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { useCmsContent } from "@/hooks/useCmsContent";
import type { SectionBackgroundSet } from "@/lib/cms/sectionBackgrounds";
import { cn } from "@/lib/utils";

function PhilosophyTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: [string, string];
}) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const firstRef = React.useRef<HTMLSpanElement | null>(null);
  const secondRef = React.useRef<HTMLSpanElement | null>(null);
  const [scale, setScale] = React.useState(1);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  React.useLayoutEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return;

    let frame = 0;

    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = first.scrollWidth;
        const natural = second.scrollWidth;
        if (target <= 0 || natural <= 0) return;
        const next = target / natural;
        setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
      });
    };

    fit();
    void document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit);

    const observer = new ResizeObserver(fit);
    observer.observe(first);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener("resize", fit);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", fit);
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, [eyebrow, title]);

  return (
    <h2
      ref={ref}
      className="font-display w-max max-w-full text-[clamp(1.35rem,5.4vw,4rem)] font-medium leading-[1.05]"
    >
      <span className="block overflow-hidden">
        <motion.span
          className="block text-[var(--nh-white)]"
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
        >
          <span ref={firstRef} className="inline-block whitespace-nowrap">
            {eyebrow}
          </span>
        </motion.span>
      </span>
      <span
        className="block overflow-hidden"
        style={{ height: `${scale * 1.05}em` }}
      >
        <motion.span
          className="block"
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}
        >
          <span
            ref={secondRef}
            className="inline-block origin-top-left whitespace-nowrap will-change-transform"
            style={{ transform: `scale(${scale})` }}
          >
            <span className="text-[var(--nh-white)]">{title[0]} </span>
            <span className="text-[var(--nh-red)]">{title[1]}</span>
          </span>
        </motion.span>
      </span>
    </h2>
  );
}

function AccentBody({
  body,
  accent,
  className,
}: {
  body: string;
  accent?: string;
  className?: string;
}) {
  if (!accent) {
    return <p className={className}>{body}</p>;
  }

  const parts = body.split(new RegExp(`\\b(${accent})\\b`, "i"));
  let used = false;

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (!used && part.toLowerCase() === accent.toLowerCase()) {
          used = true;
          return (
            <span key={i} className="text-[var(--nh-red)]">
              {part}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}

function PhilosophyArt({
  bg,
  className,
}: {
  bg: SectionBackgroundSet;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-[var(--nh-black)]", className)}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{
          filter: "grayscale(1) contrast(1.5) brightness(0.8)",
        }}
      >
        <ResponsiveBgImage bg={bg} />
      </motion.div>
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-42deg, rgba(255,255,255,0.65) 0 1.25px, transparent 1.25px 4.5px)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

export function NhPhilosophy() {
  const { philosophy } = newHome;
  const accent = philosophy.bodyAccent;
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.newHomePhilosophy;

  return (
    <section className="relative overflow-hidden bg-[var(--nh-black)]">
      <div className="relative px-5 py-12 md:px-[7vw] md:py-16 xl:py-20">
        <div className="relative mx-auto aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-video">
          <div className="absolute inset-[5%_4%] overflow-hidden sm:inset-[5%] lg:inset-[6%_5%]">
            <PhilosophyArt bg={bg} className="absolute inset-0" />
          </div>

          <Reveal className="absolute top-0 left-0 z-10 max-w-[min(52rem,88%)] bg-[var(--nh-black)] p-3 sm:p-4 xl:p-6">
            <PhilosophyTitle
              eyebrow={philosophy.eyebrow}
              title={[philosophy.title[0], philosophy.title[1]]}
            />
          </Reveal>

          <Reveal
            delay={0.18}
            className="absolute right-0 bottom-0 z-10 max-w-[min(34rem,90%)] bg-[var(--nh-black)] p-3 sm:max-w-[min(34rem,58%)] sm:p-4 lg:max-w-[min(36rem,48%)] xl:max-w-[min(38rem,52%)] xl:p-6"
          >
            <AccentBody
              body={philosophy.body}
              accent={accent}
              className="font-detective text-[clamp(0.8rem,1.8vw,15.5px)] leading-[1.55] text-white/88 sm:leading-[1.65] lg:text-[clamp(1.04rem,2.34vw,1.26rem)]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
