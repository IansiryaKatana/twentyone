import { motion } from "motion/react";
import { aboutPage } from "@/data/content";
import ceoPortrait from "@/Assets/ceo-twentyone06.webp";
import aboutHeroDesktop from "@/Assets/about-us-desktop.webp";
import aboutHeroMobile from "@/Assets/about-us-mobile.webp";
import { PageShell } from "@/components/page-shell";
import { PageHero, PillCta } from "@/components/page-hero";
import { Partners } from "@/components/sections/partners";
import { AboutTeamSection } from "@/components/sections/about-team";
import { AboutWhySection } from "@/components/sections/about-why";
import { AboutAwardsSection } from "@/components/sections/about-awards";
import {
  CountUp,
  EASE,
  LinesReveal,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/anim";

export function AboutPage() {
  const { milestones } = aboutPage;

  return (
    <PageShell headerVariant="overlay">
      <PageHero
        eyebrow={aboutPage.eyebrow}
        title={[...aboutPage.title]}
        description={aboutPage.description}
        image={aboutHeroDesktop}
        imageMobile={aboutHeroMobile}
      />

      <section id="press" className="scroll-mt-24 bg-[var(--nh-black)] py-20 md:py-28">
        <div className="grid w-full grid-cols-1 gap-10 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <Reveal className="overflow-hidden rounded-md">
              <motion.img
                src={ceoPortrait}
                alt="Govind Shepley — Twentyone06"
                className="aspect-[4/5] w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </Reveal>
          </div>
          <div className="flex flex-col justify-center md:col-span-7 md:pl-8">
            <LinesReveal
              as="h2"
              lines={[...aboutPage.storyTitle]}
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-tighter text-[var(--nh-white)]"
            />
            <Reveal delay={0.15} className="mt-8 max-w-xl space-y-4">
              {aboutPage.story.map((para) => (
                <p
                  key={para}
                  className="text-sm leading-relaxed text-white/75"
                >
                  {para}
                </p>
              ))}
              <p className="text-sm leading-relaxed text-white/75">
                {aboutPage.recognition}
              </p>
              <p className="pt-2 text-[0.65rem] font-light uppercase tracking-[0.14em] text-white/55">
                {aboutPage.recognitionCredits}
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10">
              <PillCta
                to="/contact"
                className="bg-[var(--nh-red)] text-[var(--nh-white)] hover:bg-[var(--nh-white)] hover:text-[var(--nh-black)] [&_span]:bg-[var(--nh-white)] [&_span]:text-[var(--nh-black)] group-hover:[&_span]:bg-[var(--nh-black)] group-hover:[&_span]:text-[var(--nh-white)]"
              >
                {aboutPage.cta}
              </PillCta>
            </Reveal>
          </div>
        </div>
      </section>

      <AboutTeamSection />

      <AboutWhySection />

      <Partners />

      <section className="bg-[var(--nh-black)] py-20 md:py-28">
        <div className="px-5 md:px-[7vw]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <LinesReveal
                as="h2"
                lines={[...milestones.title]}
                className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-tighter text-[var(--nh-white)]"
              />
            </div>
            <Reveal delay={0.12} className="md:col-span-6 md:col-start-7">
              <p className="max-w-xl text-sm leading-relaxed text-[var(--nh-muted)] md:text-base">
                {milestones.body}
              </p>

              <Stagger
                stagger={0.1}
                className="mt-10 grid grid-cols-3 gap-3 border-t border-white/20 pt-8 sm:gap-6"
              >
                {milestones.stats.map((stat) => (
                  <StaggerItem key={stat.label}>
                    <CountUp
                      to={stat.value}
                      suffix={stat.suffix}
                      className="font-display text-[clamp(1.75rem,5vw,3.25rem)] font-medium leading-none tracking-tighter text-[var(--nh-white)]"
                    />
                    <p className="mt-2 text-[10px] uppercase leading-snug tracking-[0.14em] text-white/75 sm:mt-3 sm:text-xs sm:tracking-[0.18em]">
                      {stat.label}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </div>
      </section>

      <AboutAwardsSection />
    </PageShell>
  );
}
