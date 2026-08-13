import * as React from "react";
import { motion, useInView } from "motion/react";
import { newHome } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { EASE, Reveal } from "@/components/anim";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { useCmsContent } from "@/hooks/useCmsContent";
import type { SectionBackgroundSet } from "@/lib/cms/sectionBackgrounds";
import { cn } from "@/lib/utils";

function MaskedHeading({
  lines,
  className,
}: {
  lines: { text: string; className?: string }[];
  className?: string;
}) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <h2
      ref={ref}
      className={cn(
        "font-display font-medium leading-[1.02]",
        className,
      )}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={cn("block", line.className)}
            initial={{ y: "115%" }}
            animate={inView ? { y: "0%" } : { y: "115%" }}
            transition={{
              duration: 0.95,
              ease: EASE,
              delay: 0.1 + i * 0.12,
            }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

function PhilosophyDesktopTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: [string, string];
}) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const size = "text-[clamp(2.35rem,3.6vw,4rem)]";

  return (
    <h2
      ref={ref}
      className={cn(
        "font-display font-medium leading-[1.05]",
        size,
      )}
    >
      <span className="block overflow-hidden">
        <motion.span
          className="block whitespace-nowrap text-[var(--nh-white)]"
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
        >
          {eyebrow}
        </motion.span>
      </span>
      <span className="-mt-[0.06em] block overflow-hidden">
        <motion.span
          className="block whitespace-nowrap"
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.2 }}
        >
          <span className="text-[var(--nh-white)]">{title[0]} </span>
          <span className="text-[var(--nh-red)]">{title[1]}</span>
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
      {/* Mobile / tablet — stacked editorial */}
      <div className="lg:hidden">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-20">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
              {philosophy.eyebrow}
            </p>
          </Reveal>

          <MaskedHeading
            className="mt-6 max-w-xl text-[clamp(2.5rem,8vw,4.5rem)]"
            lines={[
              {
                text: philosophy.title[0],
                className: "text-[var(--nh-white)]",
              },
              {
                text: philosophy.title[1],
                className: "text-[var(--nh-red)]",
              },
            ]}
          />

          <Reveal delay={0.25} className="mt-8 max-w-xl">
            <AccentBody
              body={philosophy.body}
              accent={accent}
              className="font-detective text-sm leading-relaxed text-white/75 md:text-[15px]"
            />
          </Reveal>

          <Reveal delay={0.35} className="mt-10">
            <BrandButton to={philosophy.ctaTo}>{philosophy.cta}</BrandButton>
          </Reveal>
        </div>

        <Reveal y={40} amount={0.2} className="relative min-h-[380px]">
          <PhilosophyArt bg={bg} className="absolute inset-0" />
        </Reveal>
      </div>

      {/* Desktop — one composition: art frame + corner text slabs cutting into it */}
      <div className="relative hidden px-5 py-16 md:px-[7vw] lg:block xl:py-20">
        <div className="relative mx-auto aspect-video w-full">
          <div className="absolute inset-[6%_5%] overflow-hidden">
            <PhilosophyArt bg={bg} className="absolute inset-0" />
          </div>

          {/* Top-left title slab — overlaps art */}
          <Reveal className="absolute top-0 left-0 z-10 max-w-[min(52rem,70%)] bg-[var(--nh-black)] p-5 xl:p-6">
            <PhilosophyDesktopTitle
              eyebrow={philosophy.eyebrow}
              title={[philosophy.title[0], philosophy.title[1]]}
            />
          </Reveal>

          {/* Bottom-right body slab — overlaps art */}
          <Reveal
            delay={0.18}
            className="absolute right-0 bottom-0 z-10 max-w-[min(26rem,36%)] bg-[var(--nh-black)] p-5 xl:p-6"
          >
            <AccentBody
              body={philosophy.body}
              accent={accent}
              className="font-detective text-[12.5px] leading-[1.65] text-white/88 xl:text-[13.5px]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
