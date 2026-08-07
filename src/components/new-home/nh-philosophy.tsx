import * as React from "react";
import { motion, useInView } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { newHome } from "@/data/content";
import philosophyImage from "@/Assets/we-design-for-twentyone06.webp";
import { EASE, Reveal } from "@/components/anim";
import { cn } from "@/lib/utils";

function MaskedHeading({
  lines,
}: {
  lines: { text: string; className?: string }[];
}) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <h2
      ref={ref}
      className="font-display mt-6 max-w-xl text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-tighter"
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
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

export function NhPhilosophy() {
  const { philosophy } = newHome;

  return (
    <section className="relative grid min-h-[min(90svh,900px)] grid-cols-1 overflow-hidden bg-[var(--nh-black)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-20 md:px-10 md:py-28 lg:px-16 xl:px-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
            {philosophy.eyebrow}
          </p>
        </Reveal>

        <MaskedHeading
          lines={[
            { text: philosophy.title[0], className: "text-[var(--nh-white)]" },
            { text: philosophy.title[1], className: "text-[var(--nh-red)]" },
          ]}
        />

        <Reveal delay={0.25} className="mt-8 max-w-xl">
          <p className="text-sm leading-relaxed text-white/70 md:text-[15px]">
            {philosophy.body}
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-10">
          <Link
            to={philosophy.ctaTo}
            className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-[var(--nh-white)]"
          >
            {philosophy.cta}
            <span className="flex size-9 items-center justify-center rounded-md bg-[var(--nh-red)] text-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </Reveal>
      </div>

      <Reveal y={40} amount={0.2} className="relative min-h-[420px] lg:min-h-full">
        <motion.img
          src={philosophyImage}
          alt="We design for people — Twentyone06"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{
            filter: "grayscale(1) contrast(1.35) brightness(0.85)",
          }}
        />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
            backgroundSize: "3px 3px",
            mixBlendMode: "overlay",
          }}
        />
      </Reveal>
    </section>
  );
}
