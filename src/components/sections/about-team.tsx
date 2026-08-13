import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Instagram, Linkedin } from "lucide-react";
import type { ReactNode } from "react";
import { aboutPage, type TeamMember } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { cn } from "@/lib/utils";

function SocialBadge({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: ReactNode;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-white shadow-sm transition hover:opacity-90",
        className,
      )}
    >
      {children}
    </a>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const linkedin = member.linkedin?.trim();
  const instagram = member.instagram?.trim();

  return (
    <article className="group text-center">
      <div className="relative overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="aspect-[3/4] w-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="flex aspect-[3/4] w-full items-center justify-center bg-sand/40 text-xs uppercase tracking-[0.18em] text-muted-ink"
            aria-hidden
          >
            Photo soon
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-[var(--clay)]/55 transition-opacity duration-500 md:block md:group-hover:opacity-0"
        />

        {(linkedin || instagram) && (
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            {linkedin ? (
              <SocialBadge
                href={linkedin}
                label={`${member.name} on LinkedIn`}
                className="bg-[#0A66C2]"
              >
                <Linkedin className="size-3.5 fill-current" strokeWidth={0} />
              </SocialBadge>
            ) : null}
            {instagram ? (
              <SocialBadge
                href={instagram}
                label={`${member.name} on Instagram`}
                className="bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]"
              >
                <Instagram className="size-3.5" strokeWidth={2} />
              </SocialBadge>
            ) : null}
          </div>
        )}
      </div>

      <h3 className="mt-4 font-sans text-sm font-medium tracking-wide text-ink md:text-base">
        {member.name}
      </h3>
      <p className="mt-1 text-xs tracking-wide text-crimson md:text-sm">{member.title}</p>
    </article>
  );
}

export function AboutTeamSection() {
  const { teamMembers: cmsTeamMembers } = useCmsContent();
  const teamMembers = cmsTeamMembers.filter(
    (member) => !/govind/i.test(member.name),
  );
  const { eyebrow, title, description } = aboutPage.team;
  const reduced = useReducedMotionSafe();
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [perView, setPerView] = React.useState(4);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    const updatePerView = () => {
      const width = window.innerWidth;
      setPerView(width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4);
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
  }, [perView, teamMembers.length]);

  const gapRem = perView === 1 ? 1 : 1.5;
  const maxIndex = Math.max(0, teamMembers.length - perView);

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

  if (teamMembers.length === 0) return null;

  const pageCount = maxIndex + 1;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="px-5 md:px-[7vw]">
        <div className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-ink">{eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] text-ink">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-ink">{description}</p>
          </Reveal>

          {maxIndex > 0 ? (
            <Reveal delay={0.1} className="hidden shrink-0 items-center gap-2 md:flex">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous team members"
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border border-ink/25 text-ink transition-all duration-300",
                  index === 0
                    ? "cursor-not-allowed opacity-30"
                    : "hover:border-crimson hover:bg-crimson hover:text-white",
                )}
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index >= maxIndex}
                aria-label="Next team members"
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border border-ink/25 text-ink transition-all duration-300",
                  index >= maxIndex
                    ? "cursor-not-allowed opacity-30"
                    : "hover:border-crimson hover:bg-crimson hover:text-white",
                )}
              >
                <ArrowRight className="size-3.5" />
              </button>
            </Reveal>
          ) : null}
        </div>

        <div className="relative mt-12 md:mt-16">
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex touch-pan-y gap-4 md:gap-6"
              animate={{ x: reduced ? 0 : -(index * step) }}
              transition={reduced ? { duration: 0 } : { duration: 0.75, ease: EASE }}
              {...swipe}
            >
              {teamMembers.map((member) => (
                <div
                  key={`${member.name}-${member.title}`}
                  className="shrink-0"
                  style={{
                    width:
                      perView === 1
                        ? "100%"
                        : `calc((100% - ${(perView - 1) * gapRem}rem) / ${perView})`,
                  }}
                >
                  <TeamCard member={member} />
                </div>
              ))}
            </motion.div>
          </div>

          {pageCount > 1 ? (
            <div
              className="mt-8 flex items-center justify-center gap-2 md:mt-10"
              role="tablist"
              aria-label="Team pages"
            >
              {Array.from({ length: pageCount }, (_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  role="tab"
                  aria-selected={index === dotIndex}
                  aria-label={`Show team page ${dotIndex + 1}`}
                  onClick={() => setIndex(dotIndex)}
                  className={cn(
                    "h-1.5 rounded-none transition-all duration-300",
                    index === dotIndex
                      ? "w-8 bg-crimson"
                      : "w-4 bg-ink/20 hover:bg-ink/40",
                  )}
                />
              ))}
            </div>
          ) : null}

          {maxIndex > 0 ? (
            <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous team members"
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border border-ink/25 text-ink transition-all duration-300",
                  index === 0
                    ? "cursor-not-allowed opacity-30"
                    : "hover:border-crimson hover:bg-crimson hover:text-white",
                )}
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index >= maxIndex}
                aria-label="Next team members"
                className={cn(
                  "flex size-10 items-center justify-center rounded-md border border-ink/25 text-ink transition-all duration-300",
                  index >= maxIndex
                    ? "cursor-not-allowed opacity-30"
                    : "hover:border-crimson hover:bg-crimson hover:text-white",
                )}
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
