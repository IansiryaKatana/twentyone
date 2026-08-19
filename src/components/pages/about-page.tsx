import { motion } from "motion/react";
import { aboutPage } from "@/data/content";
import ceoPortrait from "@/Assets/ceo-twentyone06.webp";
import readyToWorkBg from "@/Assets/ready-to-work-together.webp";
import { PageShell } from "@/components/page-shell";
import { PageHero, PillCta } from "@/components/page-hero";
import { BrandButton } from "@/components/brand-button";
import { Partners } from "@/components/sections/partners";
import { AboutTeamSection } from "@/components/sections/about-team";
import { AboutWhySection } from "@/components/sections/about-why";
import { AboutAwardsSection } from "@/components/sections/about-awards";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import { useCmsContent } from "@/hooks/useCmsContent";
import {
  CountUp,
  EASE,
  LinesReveal,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/anim";

export function AboutPage() {
  const { milestones, workTogether } = aboutPage;
  const { sectionBackgrounds, teamMembers } = useCmsContent();
  const bg = sectionBackgrounds.about;
  const founder =
    teamMembers.find((member) => /govind/i.test(member.name)) ?? null;
  const founderImage = founder?.image?.trim() || ceoPortrait;
  const founderName = founder?.name?.trim() || "Govind Shepley";
  const founderTitle =
    founder?.title?.trim() || "Founder & Creative Director";

  return (
    <PageShell headerVariant="overlay">
      <PageHero
        eyebrow={aboutPage.eyebrow}
        title={[...aboutPage.title]}
        titleClassName="font-display text-[clamp(5rem,12vw,8.8rem)] md:text-[clamp(2.5rem,6vw,5.5rem)]"
        image={bg.desktop}
        imageTablet={bg.tablet}
        imageMobile={bg.mobile}
      />

      <section id="press" className="scroll-mt-24 bg-[var(--nh-black)] py-20 md:py-28">
        <div className="grid w-full grid-cols-1 items-stretch gap-10 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <Reveal className="relative h-full overflow-hidden rounded-md">
              <motion.img
                src={founderImage}
                alt={`${founderName}, ${founderTitle}`}
                className="aspect-[4/5] h-full w-full object-cover object-top md:aspect-auto"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pb-5 pt-16">
                <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium uppercase leading-[1.05] text-[var(--nh-white)]">
                  {founderName}
                </p>
                <p className="font-detective mt-1.5 text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.3] text-white/75">
                  {founderTitle}
                </p>
              </div>
            </Reveal>
          </div>
          <div className="flex flex-col justify-center md:col-span-7 md:pl-8">
            <LinesReveal
              as="h2"
              lines={[...aboutPage.storyTitle]}
              className="font-display text-[clamp(5rem,12vw,8.8rem)] font-medium leading-[0.92] text-[var(--nh-white)] md:text-[clamp(2.5rem,6vw,5.5rem)]"
            />
            <Reveal delay={0.15} className="mt-8 max-w-xl space-y-4">
              {aboutPage.story.map((para) => (
                <p
                  key={para}
                  className="font-detective text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.35] text-white/75"
                >
                  {para}
                </p>
              ))}
              <p className="font-detective text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.35] text-white/75">
                {aboutPage.recognition}
              </p>
              <p className="pt-2 text-[0.65rem] font-light uppercase tracking-[0.14em] text-white/55">
                {aboutPage.recognitionCredits}
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10">
              <PillCta to="/contact" variant="red">
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
          <div className="grid grid-cols-1 gap-10 md:gap-12">
            <div className="flex justify-center">
              <NhSectionTitle
                title={milestones.title}
                tone="dark"
              />
            </div>
            <Reveal
              delay={0.12}
              className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16"
            >
              <p className="font-detective max-w-xl text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.25] text-[var(--nh-muted)] md:text-left">
                {milestones.body}
              </p>

              <Stagger
                stagger={0.1}
                className="grid grid-cols-3 gap-3 border-t border-white/20 pt-8 sm:gap-6 md:border-t-0 md:border-l md:pt-0 md:pl-10 lg:pl-14"
              >
                {milestones.stats.map((stat, i) => (
                  <StaggerItem key={stat.label} className="text-center md:text-left">
                    <CountUp
                      to={stat.value}
                      suffix={stat.suffix}
                      delay={0.35 + i * 0.15}
                      duration={2.4}
                      className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] text-[var(--nh-white)]"
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

      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-[var(--nh-black)] py-20 md:min-h-[826px] md:py-24">
        <img
          src={readyToWorkBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-6 px-5 text-center md:gap-7 md:px-[7vw]">
          <LinesReveal
            as="h2"
            lines={[...workTogether.title]}
            className="font-display w-full max-w-full text-[clamp(5rem,12vw,8.8rem)] font-medium leading-[0.92] text-[var(--nh-white)] lg:text-[clamp(5.2rem,12.48vw,11.44rem)]"
            lineClassName="whitespace-normal md:whitespace-nowrap"
          />
          <Reveal delay={0.15}>
            <p className="font-detective max-w-3xl text-[clamp(0.945rem,1.4vw,1.225rem)] font-medium leading-[1.15] text-white/70">
              {workTogether.body}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <BrandButton to={workTogether.ctaTo} variant="red">
              {workTogether.cta}
            </BrandButton>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
