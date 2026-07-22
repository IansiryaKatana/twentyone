import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { hero } from "@/data/content";
import { EASE, LinesReveal } from "@/components/anim";

export function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
      {/* Background image with slow Ken-Burns zoom */}
      <div className="absolute inset-0">
        <img
          src={hero.image}
          alt="Luxury living room designed by Twentyone06"
          className="animate-kenburns h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
          className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-cream/70"
        >
          <span className="h-px w-10 bg-cream/50" />
          {hero.eyebrow}
        </motion.p>

        <LinesReveal
          as="h1"
          lines={hero.title}
          delay={0.5}
          className="font-display max-w-4xl text-[clamp(2.75rem,8vw,7rem)] font-normal leading-[0.92] text-cream"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1 }}
          className="mt-7 max-w-md text-sm leading-relaxed text-cream/75 md:text-base"
        >
          {hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/projects"
            className="group flex items-center gap-2 rounded-full bg-cream py-2 pl-6 pr-2 text-sm text-ink transition-colors hover:bg-white"
          >
            {hero.primaryCta}
            <span className="flex size-8 items-center justify-center rounded-full bg-ink text-cream transition-all duration-300 group-hover:rotate-45 group-hover:bg-crimson">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
          <Link
            to="/contact"
            className="group flex items-center gap-2 rounded-full border border-cream/40 py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-cream/10"
          >
            {hero.secondaryCta}
            <span className="flex size-8 items-center justify-center rounded-full border border-cream/40 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 hidden md:block"
      >
        <div className="flex h-14 w-8 items-start justify-center rounded-full border border-cream/40 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-cream/80"
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
