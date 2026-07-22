import { motion } from "motion/react";
import { aboutPage, stats } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero, PillCta } from "@/components/page-hero";
import { Partners } from "@/components/sections/partners";
import {
  CountUp,
  EASE,
  LinesReveal,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/anim";

export function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow={aboutPage.eyebrow}
        title={[...aboutPage.title]}
        description={aboutPage.description}
      />

      <section className="bg-cream pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <Reveal className="overflow-hidden rounded-md">
              <motion.img
                src={aboutPage.imageA}
                alt="Studio craft"
                className="aspect-[4/5] w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </Reveal>
          </div>
          <div className="flex flex-col justify-center md:col-span-7 md:pl-8">
            <LinesReveal
              as="h2"
              lines={["Crafted With Care,", "Delivered With Clarity"]}
              className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal leading-[1.05] text-ink"
            />
            <Reveal delay={0.15} className="mt-8 space-y-4">
              {aboutPage.story.map((para) => (
                <p
                  key={para}
                  className="max-w-lg text-sm leading-relaxed text-muted-ink"
                >
                  {para}
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.25} className="mt-10">
              <PillCta to="/contact">{aboutPage.cta}</PillCta>
            </Reveal>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[1440px] px-5 md:mt-24 md:px-10">
          <Reveal className="overflow-hidden rounded-md">
            <motion.img
              src={aboutPage.imageB}
              alt="Twentyone06 interior"
              className="aspect-[21/9] w-full object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Stagger
            stagger={0.12}
            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          >
            {stats.map((stat) => (
              <StaggerItem
                key={stat.sub}
                className="rounded-lg border border-line/60 bg-cream p-6 md:p-8"
              >
                <div className="flex items-baseline gap-1 font-display text-ink">
                  <CountUp
                    to={stat.value}
                    suffix={stat.suffix}
                    className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-normal leading-none tracking-tight"
                  />
                  <span className="ml-1 font-sans text-xs tracking-wide text-muted-ink">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-6 text-xs tracking-wide text-muted-ink">
                  {stat.sub}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Partners />
    </PageShell>
  );
}
