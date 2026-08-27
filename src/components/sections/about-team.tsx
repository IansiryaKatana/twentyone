import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Instagram, Linkedin } from "lucide-react";
import { aboutPage, type TeamMember } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { HexIconButton } from "@/components/hex-icon-button";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import { cn } from "@/lib/utils";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";

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
            className="aspect-[3/4] w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
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

        {(linkedin || instagram) && (
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            {linkedin ? (
              <HexIconButton
                href={linkedin}
                label={`${member.name} on LinkedIn`}
                size="sm"
                tone="linkedin"
              >
                <Linkedin className="size-3.5 fill-current" strokeWidth={0} />
              </HexIconButton>
            ) : null}
            {instagram ? (
              <HexIconButton
                href={instagram}
                label={`${member.name} on Instagram`}
                size="sm"
                tone="instagram"
              >
                <Instagram className="size-3.5" strokeWidth={2} />
              </HexIconButton>
            ) : null}
          </div>
        )}
      </div>

      <h3 className="font-display mt-4 text-[clamp(1.640625rem,3vw,1.734375rem)] font-medium uppercase leading-[0.92] tracking-[0.02em] text-white md:text-[clamp(2.053125rem,3.75vw,2.165625rem)]">
        {member.name}
      </h3>
      <p className="font-detective mt-1 text-[0.9375rem] tracking-wide text-crimson md:text-[1.09375rem]">
        {member.title}
      </p>
    </article>
  );
}

export function AboutTeamSection() {
  const { teamMembers: cmsTeamMembers, sectionBackgrounds } = useCmsContent();
  const teamMembers = cmsTeamMembers.filter(
    (member) => !/govind/i.test(member.name),
  );
  const { eyebrow, title, description } = aboutPage.team;
  const teamBg = sectionBackgrounds.aboutTeam;
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

  const gapRem = 0;
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
    <section className="relative overflow-hidden bg-cream py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <ResponsiveBgImage bg={teamBg} />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
      />
      <div className="relative px-5 md:px-[7vw]">
        <div className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <p className="font-detective text-[clamp(1.05rem,1.8vw,1.25rem)] uppercase tracking-[0.22em] leading-[1.35] text-white/75">{eyebrow}</p>
            <div className="mt-3 flex justify-center">
              <NhSectionTitle title={title} tone="dark" />
            </div>
            <p className="font-detective mx-auto mt-4 max-w-md text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.35] text-white/75">{description}</p>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-12 md:mt-16">
        <div className="flex items-center gap-3 px-5 md:gap-5 md:px-6 lg:px-10">
          {maxIndex > 0 ? (
            <Reveal
              delay={0.1}
              className="hidden shrink-0 md:block"
            >
              <HexIconButton
                label="Previous team members"
                size="sm"
                tone="dark"
                disabled={index === 0}
                onClick={prev}
                className="size-10 bg-transparent [--btn-cut:10px]"
              >
                <ArrowLeft className="size-3.5" />
              </HexIconButton>
            </Reveal>
          ) : null}

          <div className="min-w-0 flex-1 overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex touch-pan-y gap-0"
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

          {maxIndex > 0 ? (
            <Reveal
              delay={0.1}
              className="hidden shrink-0 md:block"
            >
              <HexIconButton
                label="Next team members"
                size="sm"
                tone="dark"
                disabled={index >= maxIndex}
                onClick={next}
                className="size-10 bg-transparent [--btn-cut:10px]"
              >
                <ArrowRight className="size-3.5" />
              </HexIconButton>
            </Reveal>
          ) : null}
        </div>

        {pageCount > 1 ? (
          <div
            className="mt-8 flex items-center justify-center gap-2 px-5 md:mt-10 md:px-[7vw]"
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
                    : "w-4 bg-white/25 hover:bg-white/45",
                )}
              />
            ))}
          </div>
        ) : null}

        {maxIndex > 0 ? (
          <div className="mt-6 flex items-center justify-center gap-2 px-5 md:hidden">
            <HexIconButton
              label="Previous team members"
              size="sm"
              tone="dark"
              disabled={index === 0}
              onClick={prev}
              className="size-10 bg-transparent [--btn-cut:10px]"
            >
              <ArrowLeft className="size-3.5" />
            </HexIconButton>
            <HexIconButton
              label="Next team members"
              size="sm"
              tone="dark"
              disabled={index >= maxIndex}
              onClick={next}
              className="size-10 bg-transparent [--btn-cut:10px]"
            >
              <ArrowRight className="size-3.5" />
            </HexIconButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
