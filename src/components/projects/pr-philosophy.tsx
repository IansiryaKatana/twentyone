import * as React from "react";
import { motion, useInView } from "motion/react";
import { projectsPage } from "@/data/content";
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
      className="font-display text-center text-[clamp(2.75rem,7vw,6rem)] font-medium leading-[1.02]"
    >
      {lines.map((line, i) => (
        <span key={line.text} className="inline overflow-hidden">
          {i > 0 ? " " : null}
          <span className="inline-block overflow-hidden align-bottom pb-[0.08em]">
            <motion.span
              className={cn("inline-block", line.className)}
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
        </span>
      ))}
    </h2>
  );
}

export function PrPhilosophy() {
  const { philosophy } = projectsPage;

  return (
    <section className="relative z-10 flex min-h-[100svh] flex-col justify-center bg-[var(--nh-black)] px-5 py-20 md:px-10 md:py-28 lg:px-[7vw]">
      <Reveal>
        <p className="text-center text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
          {philosophy.eyebrow}
        </p>
      </Reveal>

      <MaskedHeading
        lines={[
          { text: philosophy.title[0], className: "text-[var(--nh-white)]" },
          { text: philosophy.title[1], className: "text-[var(--nh-red)]" },
        ]}
      />

      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-8 md:mt-16 md:gap-10">
        <Reveal>
          <p className="font-display text-center text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.05] text-[var(--nh-white)]">
            {philosophy.quote}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="font-detective text-center text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-white/65">
            {philosophy.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
