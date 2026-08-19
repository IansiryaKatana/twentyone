import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { newHome } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { cn } from "@/lib/utils";
import woodBg from "@/Assets/wood-01.jpg";

const QUOTE_PREVIEW_CHARS = 220;

function NavArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 hover:border-[var(--nh-red)] hover:bg-[var(--nh-red)] md:size-11"
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </button>
  );
}

export function NhTestimonial() {
  const cms = useCmsContent();
  const testimonials =
    cms.testimonials.length > 0 ? cms.testimonials : newHome.testimonials;
  const reduced = useReducedMotionSafe();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const testimonial = testimonials[index] ?? testimonials[0];

  React.useEffect(() => {
    setExpanded(false);
  }, [index]);

  React.useEffect(() => {
    if (paused || expanded || reduced || testimonials.length === 0) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % testimonials.length),
      7000
    );
    return () => window.clearInterval(timer);
  }, [paused, expanded, reduced, testimonials.length]);

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

  const quote = testimonial.quote.trim();
  const isLong = quote.length > QUOTE_PREVIEW_CHARS;
  const displayQuote =
    !isLong || expanded
      ? quote
      : `${quote.slice(0, QUOTE_PREVIEW_CHARS).trimEnd()}…`;

  return (
    <section
      className="relative overflow-hidden bg-[var(--nh-black)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        src={woodBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[var(--nh-black)]/55"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8 md:py-24 lg:max-w-6xl lg:px-10">
        <div className="relative w-full touch-pan-y" aria-live="polite" {...swipe}>
          {testimonials.length > 1 ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center">
              <div className="pointer-events-auto">
                <NavArrow direction="prev" onClick={prev} />
              </div>
            </div>
          ) : null}
          {testimonials.length > 1 ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center">
              <div className="pointer-events-auto">
                <NavArrow direction="next" onClick={next} />
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE }}
              className="grid grid-cols-1 items-stretch gap-8 px-12 sm:px-14 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:px-16 lg:text-left xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-16"
            >
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[16rem] overflow-hidden bg-[var(--nh-panel)] lg:mx-0 lg:max-w-none lg:min-h-[28rem] lg:aspect-auto">
                {testimonial.image?.trim() ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex w-full flex-col items-center lg:items-start">
                <div>
                  <p className="font-display text-[clamp(2.22rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-[var(--nh-red)]">
                    {testimonial.name}
                  </p>
                  {testimonial.role ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      {testimonial.role}
                    </p>
                  ) : null}
                </div>

                <span
                  aria-hidden
                  className="font-display mt-5 block text-[clamp(5.5rem,14vw,10rem)] leading-[0.7] text-[var(--nh-red)] md:mt-6"
                >
                  “
                </span>

                <blockquote className="font-detective -mt-6 max-w-2xl text-[clamp(1.2rem,2.5vw,1.7rem)] leading-[1.2] tracking-tighter text-[var(--nh-white)] md:-mt-10">
                  {displayQuote}
                </blockquote>

                {isLong ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--nh-red)] transition-colors hover:text-white"
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                ) : null}

                <span
                  aria-hidden
                  className="font-display mt-auto block pt-4 text-[clamp(5.5rem,14vw,10rem)] leading-[0.7] text-[var(--nh-red)] lg:self-end"
                >
                  ”
                </span>
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
