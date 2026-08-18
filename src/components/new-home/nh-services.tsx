import * as React from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { newHome } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import {
  EASE,
  Reveal,
  Stagger,
  StaggerItem,
  useReducedMotionSafe,
} from "@/components/anim";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { cn } from "@/lib/utils";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import interiorArchitectureIcon from "@/Assets/interior architechture.png";
import brandDesignIcon from "@/Assets/brand design.png";
import designManagementIcon from "@/Assets/design management.png";

const icons = [
  interiorArchitectureIcon,
  brandDesignIcon,
  designManagementIcon,
  interiorArchitectureIcon,
];

type ServiceCardItem = {
  index: string;
  slug: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  image: string;
};

function ServiceCard({
  item,
  index,
}: {
  item: ServiceCardItem;
  index: number;
}) {
  const icon = icons[index] ?? interiorArchitectureIcon;

  return (
    <Link
      to="/services"
      hash={item.slug}
      className="group relative block aspect-[0.78] min-h-[460px] overflow-hidden bg-[#ddd] md:min-h-0 lg:aspect-[0.72]"
    >
      {item.image ? (
        <motion.img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.045 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      ) : null}
      <div className="absolute inset-0 bg-white/24 transition-colors duration-500 group-hover:bg-white/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/65 via-white/18 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/15" />

      <div className="relative z-10 flex h-full flex-col p-4 md:p-[clamp(1rem,1.6vw,1.75rem)]">
        <div className="flex flex-col items-start gap-3 md:gap-4">
          <span className="text-sm font-medium tracking-[0.18em] text-black/70 md:text-base">
            {item.index}
          </span>
          <img
            src={icon}
            alt=""
            aria-hidden
            className="size-10 object-contain md:size-12"
          />
        </div>

        <div className="mt-auto md:max-w-none">
          <h3 className="font-detective max-w-[95%] text-[clamp(1.9rem,6.5vw,2.5rem)] font-semibold leading-[1.02] normal-case text-black lg:text-[clamp(1.7rem,2.2vw,2.35rem)] xl:text-[clamp(1.65rem,1.4vw,2.15rem)]">
            {item.title}
          </h3>
          <p className="mt-3 max-w-[18rem] text-[11px] leading-relaxed text-black/65 md:text-xs md:transition-all md:duration-500 md:group-hover:max-h-0 md:group-hover:overflow-hidden md:group-hover:opacity-0">
            {item.description}
          </p>

          <ul className="mt-3 hidden space-y-1.5 text-[11px] leading-snug text-black/70 md:block md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:group-hover:max-h-[22rem] md:group-hover:translate-y-0 md:group-hover:opacity-100">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-[0.35em] size-1 shrink-0 rounded-full bg-[var(--nh-red)]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <span className="btn-cut mt-5 inline-flex items-center justify-center gap-2 bg-[var(--nh-red)] px-[1.4rem] py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors duration-300 group-hover:bg-black md:mt-6">
            {item.cta}
            <ChevronRight className="size-3.5 shrink-0" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NhServices() {
  const cms = useCmsContent();
  const section = cms.newHome.services ?? newHome.services;
  const reduced = useReducedMotionSafe();
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [step, setStep] = React.useState(0);

  const items: ServiceCardItem[] =
    cms.services.length > 0
      ? cms.services.map((service, i) => ({
          index: service.indexLabel || String(i + 1).padStart(2, "0"),
          slug: service.slug,
          title: service.title || service.label,
          description: service.description || service.intro,
          bullets: service.bullets ?? [],
          cta: service.cta || "Learn more",
          image: service.image || service.heroImage,
        }))
      : newHome.services.items.map((item) => ({
          index: item.index,
          slug: item.slug,
          title: item.title,
          description: item.description,
          bullets: item.bullets,
          cta: item.cta,
          image: item.image,
        }));

  React.useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      if (!track || !first) return;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      setStep(first.offsetWidth + gap);
    };

    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  React.useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(items.length - 1, 0)));
  }, [items.length]);

  const maxIndex = Math.max(0, items.length - 1);
  const prev = React.useCallback(
    () => setIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const next = React.useCallback(
    () => setIndex((i) => Math.min(maxIndex, i + 1)),
    [maxIndex],
  );
  const swipe = useCarouselSwipe({
    onNext: next,
    onPrev: prev,
    canNext: index < maxIndex,
    canPrev: index > 0,
    enabled: maxIndex > 0,
  });

  return (
    <section className="bg-[var(--nh-gray)] py-14 text-[var(--nh-black)] lg:py-0">
      <Reveal className="mb-8 flex justify-center px-5 lg:hidden">
        <NhSectionTitle title={section.title} />
      </Reveal>

      <div className="relative px-5 lg:hidden">
        <div className="overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex touch-pan-y"
            animate={{ x: -(index * step) }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }
            }
            {...swipe}
          >
            {items.map((item, itemIndex) => (
              <div key={item.slug} className="w-full shrink-0">
                <ServiceCard item={item} index={itemIndex} />
              </div>
            ))}
          </motion.div>
        </div>

        {maxIndex > 0 ? (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous service"
              className={cn(
                "absolute top-1/2 left-5 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/30 bg-[var(--nh-gray)]/80 text-black backdrop-blur-[2px] transition-colors duration-300",
                index === 0
                  ? "cursor-not-allowed opacity-30"
                  : "hover:border-[var(--nh-red)] hover:bg-[var(--nh-red)] hover:text-white",
              )}
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index === maxIndex}
              aria-label="Next service"
              className={cn(
                "absolute top-1/2 right-5 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/30 bg-[var(--nh-gray)]/80 text-black backdrop-blur-[2px] transition-colors duration-300",
                index === maxIndex
                  ? "cursor-not-allowed opacity-30"
                  : "hover:border-[var(--nh-red)] hover:bg-[var(--nh-red)] hover:text-white",
              )}
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </button>
          </>
        ) : null}
      </div>

      <div
        className="mt-7 flex items-center justify-center gap-1.5 px-5 lg:hidden"
        role="tablist"
        aria-label="Choose service slide"
      >
        {items.map((item, dotIndex) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={index === dotIndex}
            aria-label={`Show service ${dotIndex + 1}`}
            onClick={() => setIndex(dotIndex)}
            className={cn(
              "h-0.5 transition-all duration-300",
              index === dotIndex
                ? "w-7 bg-[var(--nh-red)]"
                : "w-3 bg-black/20 hover:bg-black/45"
            )}
          />
        ))}
      </div>

      <Stagger
        className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4"
        stagger={0.1}
      >
        {items.map((item, itemIndex) => (
          <StaggerItem key={item.slug}>
            <ServiceCard item={item} index={itemIndex} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.15} className="mt-10 flex justify-center px-5 lg:hidden">
        <Link
          to={section.ctaTo}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--nh-black)]"
        >
          {section.cta}
          <ArrowRight className="size-4 rotate-[-45deg] text-[var(--nh-red)] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
