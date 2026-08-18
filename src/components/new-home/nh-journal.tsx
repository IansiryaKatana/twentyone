import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { newHome, type JournalPost } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, Stagger, StaggerItem, useReducedMotionSafe } from "@/components/anim";
import { JournalCard } from "@/components/journal-card";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";
import { cn } from "@/lib/utils";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";

type JournalTabId = (typeof newHome.journal.tabs)[number]["id"];

function isTrendReport(post: JournalPost) {
  return /insight|trend/i.test(post.tag);
}

function postsForTab(posts: JournalPost[], tab: JournalTabId) {
  const filtered =
    tab === "trend-reports"
      ? posts.filter(isTrendReport)
      : posts.filter((post) => !isTrendReport(post));
  return filtered.slice(0, 3);
}

export function NhJournal() {
  const cms = useCmsContent();
  const section = cms.newHome.journal ?? newHome.journal;
  const tabs = section.tabs ?? newHome.journal.tabs;
  const allPosts = cms.journalPosts;
  const reduced = useReducedMotionSafe();
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = React.useState<JournalTabId>(tabs[0]?.id ?? "whats-new");
  const [index, setIndex] = React.useState(0);
  const [step, setStep] = React.useState(0);

  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0];
  const posts = postsForTab(allPosts, activeTab?.id ?? "whats-new");

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
  }, [posts.length, tab]);

  React.useEffect(() => {
    setIndex(0);
  }, [tab]);

  React.useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(posts.length - 1, 0)));
  }, [posts.length]);

  const maxIndex = Math.max(0, posts.length - 1);
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

  if (allPosts.length === 0) return null;

  return (
    <section className="bg-white py-20 text-[var(--nh-black)] md:py-28">
      <div className="w-full px-5 md:px-10">
        <div className="relative mb-10 md:mb-14">
          <Reveal className="flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
            <NhSectionTitle title={section.title} align="left" />
            <div className="flex w-full flex-col items-start md:max-w-md md:items-end md:text-right">
              <div
                className="flex flex-wrap items-center justify-start gap-x-8 gap-y-3 md:justify-end"
                role="tablist"
                aria-label="Journal topics"
              >
                {tabs.map((item) => {
                  const selected = item.id === activeTab?.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setTab(item.id)}
                      className={cn(
                        "font-display relative text-[clamp(1.75rem,3.2vw,3.25rem)] font-medium uppercase leading-[1.05] transition-colors",
                        selected
                          ? "text-[var(--nh-red)]"
                          : "text-black/40 hover:text-[var(--nh-black)]",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-0 -bottom-1.5 h-px bg-[var(--nh-red)] transition-opacity",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              {activeTab ? (
                <p className="font-detective mt-5 text-sm leading-relaxed text-black/55 md:text-[18px]">
                  {activeTab.description}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>

        {posts.length === 0 ? (
          <p className="font-detective text-center text-sm text-black/45">
            Nothing in this section yet.
          </p>
        ) : (
          <>
            <div className="relative lg:hidden">
              <div className="overflow-hidden">
                <motion.div
                  ref={trackRef}
                  className="flex touch-pan-y gap-5"
                  animate={{ x: reduced ? 0 : -(index * step) }}
                  transition={
                    reduced ? { duration: 0 } : { duration: 0.75, ease: EASE }
                  }
                  {...swipe}
                >
                  {posts.map((post) => (
                    <div key={post.slug} className="w-full shrink-0">
                      <JournalCard post={post} />
                    </div>
                  ))}
                </motion.div>
              </div>

              {posts.length > 1 ? (
                <div
                  className="mt-7 flex items-center justify-center gap-1.5"
                  role="tablist"
                  aria-label="Choose blog slide"
                >
                  {posts.map((post, dotIndex) => (
                    <button
                      key={post.slug}
                      type="button"
                      role="tab"
                      aria-selected={index === dotIndex}
                      aria-label={`Show blog post ${dotIndex + 1}`}
                      onClick={() => setIndex(dotIndex)}
                      className={cn(
                        "h-0.5 transition-all duration-300",
                        index === dotIndex
                          ? "w-7 bg-[var(--nh-red)]"
                          : "w-3 bg-black/20 hover:bg-black/40",
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <Stagger
              key={tab}
              animate="show"
              className="hidden grid-cols-1 gap-8 lg:grid lg:grid-cols-3 lg:gap-6"
              stagger={0.1}
            >
              {posts.map((post) => (
                <StaggerItem key={post.slug}>
                  <JournalCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}

        <Reveal delay={0.15} className="mt-10 flex justify-center md:mt-14">
          <Link
            to={section.ctaTo}
            className="group inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--nh-black)] md:gap-2"
          >
            {section.cta}
            <ArrowRight className="size-4 rotate-[-45deg] text-[var(--nh-red)] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
