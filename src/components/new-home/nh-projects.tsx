import * as React from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { newHome } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { cn } from "@/lib/utils";

export function NhProjects() {
  const { projects: section } = newHome;
  const cms = useCmsContent();
  const reduced = useReducedMotionSafe();
  const items = cms.projects.slice(0, 8);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [perView, setPerView] = React.useState(4);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const updatePerView = () => {
      const width = window.innerWidth;
      setPerView(width < 768 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4);
    };

    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  React.useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      if (!first || !track) return;
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
  }, [perView, items.length]);

  const gapRem = perView === 1 ? 1.25 : 1.5;
  const maxIndex = Math.max(0, items.length - perView);

  React.useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

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
    <section className="overflow-hidden bg-[var(--nh-black)] py-20 md:py-28">
      <div className="w-full px-5 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-4 md:mb-16">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
              {section.eyebrow}
              <span className="mx-2 text-white/25">/</span>
            </p>
            <h2 className="font-display mt-2 whitespace-nowrap text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1.04] text-[var(--nh-white)]">
              {section.title}
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="flex shrink-0 items-center gap-3 self-end md:gap-5">
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous projects"
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300",
                  index === 0
                    ? "cursor-not-allowed opacity-30"
                    : "hover:border-[var(--nh-red)] hover:bg-[var(--nh-red)]"
                )}
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index >= maxIndex}
                aria-label="Next projects"
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300",
                  index >= maxIndex
                    ? "cursor-not-allowed opacity-30"
                    : "hover:border-[var(--nh-red)] hover:bg-[var(--nh-red)]"
                )}
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            <Link
              to={section.ctaTo}
              className="group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--nh-white)] md:gap-2 md:text-[10px] md:tracking-[0.24em]"
            >
              <span className="md:hidden">View All</span>
              <span className="hidden md:inline">{section.cta}</span>
              <ArrowRight className="size-4 rotate-[-45deg] text-[var(--nh-red)] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex touch-pan-y gap-5 md:gap-6"
              animate={{ x: reduced ? 0 : -(index * step) }}
              transition={reduced ? { duration: 0 } : { duration: 0.75, ease: EASE }}
              {...swipe}
            >
              {items.map((project) => (
                <Link
                  key={project.slug}
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="group shrink-0"
                  style={{
                    width:
                      perView === 1
                        ? "100%"
                        : `calc((100% - ${(perView - 1) * gapRem}rem) / ${perView})`,
                  }}
                >
                  <div className="overflow-hidden">
                    <motion.img
                      src={project.hero}
                      alt={project.title}
                      className="aspect-[4/5] w-full object-cover"
                      whileHover={reduced ? undefined : { scale: 1.06 }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-medium leading-none text-[var(--nh-white)]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[var(--nh-red)]">
                      {project.location} / {project.category}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>

          <div
            className="mt-7 flex items-center justify-center gap-1.5 md:hidden"
            role="tablist"
            aria-label="Choose project slide"
          >
            {items.map((project, dotIndex) => (
              <button
                key={project.slug}
                type="button"
                role="tab"
                aria-selected={index === dotIndex}
                aria-label={`Show project ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={cn(
                  "h-0.5 transition-all duration-300",
                  index === dotIndex
                    ? "w-7 bg-[var(--nh-red)]"
                    : "w-3 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
