import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { newHome } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { cn } from "@/lib/utils";

export function NhTestimonial() {
  const cms = useCmsContent();
  const testimonials =
    cms.testimonials.length > 0 ? cms.testimonials : newHome.testimonials;
  const reduced = useReducedMotionSafe();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const testimonial = testimonials[index] ?? testimonials[0];

  React.useEffect(() => {
    if (paused || reduced || testimonials.length === 0) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % testimonials.length),
      7000
    );
    return () => window.clearInterval(timer);
  }, [paused, reduced, testimonials.length]);

  const prev = React.useCallback(() => {
    setIndex((current) =>
      testimonials.length === 0
        ? 0
        : (current - 1 + testimonials.length) % testimonials.length,
    );
  }, [testimonials.length]);

  const next = React.useCallback(() => {
    setIndex((current) =>
      testimonials.length === 0 ? 0 : (current + 1) % testimonials.length,
    );
  }, [testimonials.length]);

  const swipe = useCarouselSwipe({
    onNext: next,
    onPrev: prev,
    enabled: testimonials.length > 1,
  });

  if (!testimonial) return null;

  const hasImage = Boolean(testimonial.image?.trim());
  const { title } = newHome.testimonialSection;

  return (
    <section
      className="bg-[var(--nh-black)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8 md:py-24 lg:max-w-6xl lg:px-10">
        <Reveal y={20} className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="font-display text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.02] text-[var(--nh-white)]">
            {title}
          </h2>
        </Reveal>

        <div className="w-full touch-pan-y" aria-live="polite" {...swipe}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE }}
              className={cn(
                "flex flex-col items-center",
                hasImage &&
                  "lg:grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:text-left xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:gap-16",
              )}
            >
              {hasImage ? (
                <>
                  {/* Mobile / tablet — circular avatar */}
                  <div className="relative mb-6 size-16 shrink-0 overflow-hidden rounded-full bg-[#2a2a2a] md:size-20 lg:hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="absolute inset-0 h-full w-full object-cover grayscale"
                    />
                  </div>

                  {/* Desktop — 3:4 portrait beside quote */}
                  <div className="relative hidden aspect-[3/4] w-full overflow-hidden bg-[#2a2a2a] lg:block">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="absolute inset-0 h-full w-full object-cover grayscale"
                    />
                  </div>
                </>
              ) : null}

              <div
                className={cn(
                  "flex flex-col items-center",
                  hasImage && "lg:items-start",
                )}
              >
                <span
                  aria-hidden
                  className="font-display block text-[clamp(2.5rem,7vw,4.5rem)] leading-none text-[var(--nh-red)]"
                >
                  “
                </span>

                <blockquote className="font-detective -mt-3 max-w-2xl text-[clamp(1.25rem,3.2vw,2rem)] leading-[1.15] tracking-tighter text-[var(--nh-white)] md:-mt-5">
                  {testimonial.quote}
                </blockquote>

                <div className="mt-7 md:mt-8">
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--nh-red)]">
                    {testimonial.name}
                  </p>
                  {testimonial.role ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      {testimonial.role}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div
            className="mt-8 flex items-center justify-center gap-1.5 lg:mt-12"
            role="tablist"
            aria-label="Choose testimonial"
          >
            {testimonials.map((review, dotIndex) => (
              <button
                key={`${review.name}-${dotIndex}`}
                type="button"
                role="tab"
                aria-selected={index === dotIndex}
                aria-label={`Show testimonial ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={cn(
                  "h-0.5 transition-all duration-300",
                  index === dotIndex
                    ? "w-8 bg-[var(--nh-red)]"
                    : "w-4 bg-white/25 hover:bg-white/55",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
