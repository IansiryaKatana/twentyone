import { motion } from "motion/react";
import { about } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { EASE, LinesReveal, Reveal } from "@/components/anim";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 md:grid-cols-12 md:px-10">
        {/* Left rail - label + small image */}
        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-ink">
            {about.eyebrow}
          </p>
          <Reveal delay={0.1} className="mt-6 max-w-[190px]">
            <div className="overflow-hidden rounded-md">
              <motion.img
                src={about.imageA}
                alt="Elegant dining interior"
                className="aspect-[4/3] w-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </div>
          </Reveal>
        </div>

        {/* Middle - heading + copy + cta */}
        <div className="md:col-span-6">
          <LinesReveal
            as="h2"
            lines={about.title}
            className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[0.98] text-ink"
          />
          <Reveal delay={0.2} className="mt-6 max-w-lg">
            <p className="text-sm leading-relaxed text-muted-ink md:text-[15px]">
              {about.body}
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8">
            <BrandButton to="/about" variant="black">
              {about.cta}
            </BrandButton>
          </Reveal>
        </div>

        {/* Right - feature image */}
        <div className="md:col-span-3">
          <Reveal y={40} className="overflow-hidden rounded-md">
            <motion.img
              src={about.imageB}
              alt="Modern luxury kitchen"
              className="aspect-[3/4] w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
