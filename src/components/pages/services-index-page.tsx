import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import * as React from "react";
import { servicesPage } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { PageShell } from "@/components/page-shell";
import { InquiryForm } from "@/components/inquiry-form";
import { useCmsContent } from "@/hooks/useCmsContent";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { EASE, Reveal, Stagger, StaggerItem, useReducedMotionSafe } from "@/components/anim";
import { cn } from "@/lib/utils";
import contactBg from "@/Assets/contbg.jpg";

type Section = (typeof servicesPage.sections)[number];

function ServiceCta({ section }: { section: Section }) {
  if ("ctaHref" in section && section.ctaHref) {
    return (
      <BrandButton href={section.ctaHref} variant="black">
        {section.cta}
      </BrandButton>
    );
  }

  const service =
    "ctaSearch" in section && section.ctaSearch?.service
      ? section.ctaSearch.service
      : section.id;

  return (
    <BrandButton
      to="/projects"
      search={{ service }}
      hash="work"
      variant="black"
    >
      {section.cta}
    </BrandButton>
  );
}

function HeroMaskedLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotionSafe();

  return (
    <span ref={ref} className="block overflow-hidden leading-[0.95]">
      <motion.span
        className="block leading-[0.95]"
        initial={reduced ? false : { y: "115%" }}
        animate={inView ? { y: "0%" } : { y: "115%" }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function ServicesHero() {
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.services;
  const reduced = useReducedMotionSafe();

  return (
    <section className="relative min-h-[85svh] overflow-hidden bg-[var(--nh-black)] pt-28 md:min-h-[90svh] md:pt-32">
      <ResponsiveBgImage bg={bg} />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        aria-hidden
      />

      <div className="relative z-10 grid min-h-[calc(85svh-7rem)] w-full grid-cols-1 items-end gap-10 px-5 pb-14 md:min-h-[calc(90svh-8rem)] md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:pb-20">
        <div className="md:col-span-6 lg:col-span-6">
          <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/65">
            <span className="h-px w-10 bg-white/35" />
            {servicesPage.eyebrow}
          </p>
          <h1 className="font-display w-full text-[clamp(3.12rem,calc(1.32rem+6.96vw),8.7rem)] font-medium uppercase leading-[0.95] text-[var(--nh-white)] lg:text-[clamp(3.9rem,calc(1.65rem+8.7vw),10.875rem)] xl:text-[clamp(6.375rem,10.8vw,10.875rem)]">
            <HeroMaskedLine delay={reduced ? 0 : 0.35}>
              Where{" "}
              <span className="text-[var(--nh-red)]">Vision</span>
            </HeroMaskedLine>
            <HeroMaskedLine delay={reduced ? 0 : 0.47}>Meets Craft</HeroMaskedLine>
          </h1>
          <Reveal delay={0.2} className="mt-6 max-w-xl">
            <p className="font-detective text-[clamp(0.945rem,1.4vw,1.225rem)] font-medium leading-[1.15] text-white/75">
              {servicesPage.description}
            </p>
          </Reveal>
        </div>

        <nav
          aria-label="Services"
          className="md:col-span-6 lg:col-span-6"
        >
          {servicesPage.sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "group flex items-center gap-4 py-3.5 text-white transition-colors hover:text-[var(--nh-red)] md:gap-5 md:py-4",
                index < servicesPage.sections.length - 1 && "border-b border-white/20",
              )}
            >
              <span className="font-display shrink-0 text-[clamp(2.75rem,5.4vw,4.25rem)] font-medium leading-[0.85] text-white/25 md:text-[clamp(1.987rem,calc(0.841rem+4.434vw),5.542rem)] lg:text-[clamp(2.484rem,calc(1.051rem+5.542vw),6.927rem)] xl:text-[clamp(4.061rem,6.88vw,6.927rem)]">
                {section.index}
              </span>
              <span className="font-display min-w-0 flex-1 text-[clamp(1.35rem,2.5vw,1.85rem)] font-medium uppercase leading-[1.02] md:text-[clamp(1.4196rem,calc(0.6006rem+3.1668vw),3.9585rem)] md:leading-[0.95] lg:text-[clamp(1.7745rem,calc(0.75075rem+3.9585vw),4.948125rem)] xl:text-[clamp(2.900625rem,4.914vw,4.948125rem)]">
                {section.tabLabel}
              </span>
              <ChevronRight
                aria-hidden
                className="size-4 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-0.5 md:size-5"
                strokeWidth={1.75}
              />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function ServiceSection({
  section,
  reverse,
  stackIndex,
  image,
}: {
  section: Section;
  reverse: boolean;
  stackIndex: number;
  image: string;
}) {
  return (
    <section
      id={section.id}
      style={{ zIndex: stackIndex }}
      className={cn(
        "scroll-mt-24 py-20",
        reverse ? "bg-cream-2" : "bg-cream",
        // Sticky stack: each panel pins at 100vh on desktop and is covered by the next
        "md:sticky md:top-0 md:h-[100vh] md:overflow-hidden md:py-0"
      )}
    >
      <div className="grid h-full w-full grid-cols-1 items-center gap-10 px-5 md:grid-cols-12 md:gap-0 md:px-0">
        <div
          className={cn(
            "md:col-span-6 md:h-full",
            reverse ? "md:order-2" : "md:order-1"
          )}
        >
          <Reveal className="h-full">
            {image ? (
              <div className="relative aspect-[4/5] h-full overflow-hidden rounded-md md:aspect-auto md:rounded-none">
                <img
                  src={image}
                  alt={section.title}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            ) : null}
          </Reveal>
        </div>

        <div
          className={cn(
            "flex flex-col justify-center md:col-span-6 md:h-full md:overflow-y-auto md:px-10 md:py-12 lg:px-14 lg:py-14",
            reverse ? "md:order-1" : "md:order-2"
          )}
        >
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-ink">
              <span className="mr-3 tabular-nums text-crimson">
                {section.index}
              </span>
              {section.serviceLabel}
            </p>
            <h2 className="font-display mt-3 whitespace-normal text-[clamp(2.73rem,calc(1.155rem+6.09vw),7.6125rem)] font-medium uppercase leading-[0.95] text-ink md:mt-4 md:whitespace-nowrap md:text-[clamp(1.4196rem,calc(0.6006rem+3.1668vw),3.9585rem)] lg:text-[clamp(1.7745rem,calc(0.75075rem+3.9585vw),4.948125rem)] xl:text-[clamp(2.900625rem,4.914vw,4.948125rem)]">
              {section.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-5 max-w-xl space-y-3 md:mt-6 md:space-y-3.5">
            {section.body.map((para) => (
              <p
                key={para}
                className="font-detective text-[1.3125rem] font-medium leading-[1.15] text-ink md:text-[1.3875rem]"
              >
                {para}
              </p>
            ))}
          </Reveal>

          <Stagger stagger={0.05} className="mt-6 space-y-0.5 md:mt-7">
            {section.bullets.map((bullet) => (
              <StaggerItem key={bullet}>
                <div className="flex gap-3 text-sm text-ink">
                  <span className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-crimson" />
                  <span className="leading-[1.15]">{bullet}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2} className="mt-8 md:mt-9">
            <ServiceCta section={section} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesContact() {
  const { contact } = servicesPage;
  return (
    <section id="lets-talk" className="scroll-mt-24 bg-cream">
      <div className="grid w-full grid-cols-1 md:grid-cols-12 md:items-stretch">
        <div className="relative overflow-hidden px-5 py-20 md:col-span-5 md:min-h-[36rem] md:px-10 md:py-28 lg:px-[7vw]">
          <img
            src={contactBg}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-cream/70 via-cream/25 to-transparent"
            aria-hidden
          />
          <Reveal className="relative z-10 max-w-xl">
            <h2 className="font-display text-[clamp(2.73rem,calc(1.155rem+6.09vw),7.6125rem)] font-semibold uppercase leading-[0.95] text-ink md:text-[clamp(2.184rem,calc(0.924rem+4.872vw),6.09rem)] lg:text-[clamp(2.73rem,calc(1.155rem+6.09vw),7.6125rem)] xl:text-[clamp(4.4625rem,7.56vw,7.6125rem)]">
              {contact.title}
            </h2>
            <p className="font-detective mt-5 text-[1.05rem] font-medium leading-[1.15] normal-case text-ink">
              {contact.eyebrow}
            </p>
            <p className="font-detective mt-6 max-w-md text-[clamp(1.0125rem,1.5vw,1.3125rem)] font-medium leading-[1.15] text-ink">
              {contact.body}
            </p>
          </Reveal>
        </div>
        <div className="flex flex-col justify-center bg-cream px-5 py-16 md:col-span-7 md:px-10 md:py-28 lg:px-14">
          <Reveal delay={0.1}>
            <InquiryForm submitFullWidth />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ServicesIndexPage() {
  const cms = useCmsContent();

  return (
    <PageShell headerVariant="overlay">
      <ServicesHero />
      {/* Sticky stack: each service pins at 100vh; next slides over; contact releases */}
      <div className="relative">
        {servicesPage.sections.map((section, i) => {
          const live = cms.services.find((service) => service.slug === section.id);
          return (
            <ServiceSection
              key={section.id}
              section={section}
              reverse={i % 2 === 1}
              stackIndex={i + 1}
              image={live?.heroImage || live?.image || section.image}
            />
          );
        })}
      </div>
      <div className="relative z-20">
        <ServicesContact />
      </div>
    </PageShell>
  );
}
