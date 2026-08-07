import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { newHome } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
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

  if (!testimonial) return null;

  const hasImage = Boolean(testimonial.image?.trim());
  const { title } = newHome.testimonialSection;

  return (
    <section
      className="bg-[var(--nh-black)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8 md:py-24">
        <Reveal y={20} className="mb-8 md:mb-10">
          <h2 className="font-display text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[0.88] tracking-tighter text-[var(--nh-white)]">
            {title}
          </h2>
        </Reveal>

        {hasImage ? (
          <Reveal y={24} className="mb-6">
            <div className="relative size-16 overflow-hidden rounded-full bg-[#2a2a2a] md:size-20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={testimonial.image}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                  initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE }}
                />
              </AnimatePresence>
            </div>
          </Reveal>
        ) : null}

        <div className="w-full" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE }}
              className="flex flex-col items-center"
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
            </motion.div>
          </AnimatePresence>

          <div
            className="mt-8 flex items-center justify-center gap-1.5"
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
                    : "w-4 bg-white/25 hover:bg-white/55"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
