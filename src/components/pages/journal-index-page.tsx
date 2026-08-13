import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  getFeaturedPost,
  journalPage,
  journalPosts,
} from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { BrandButton } from "@/components/brand-button";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { useCmsContent } from "@/hooks/useCmsContent";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 3;

const TAG_STYLES: Record<string, string> = {
  Awards: "border-crimson/25 bg-crimson/10 text-crimson",
  Hospitality: "border-amber-700/25 bg-amber-600/10 text-amber-900",
  "Health & Wellness": "border-emerald-800/25 bg-emerald-800/10 text-emerald-900",
  Insights: "border-espresso/20 bg-espresso/[0.08] text-espresso",
  "Studio News": "border-sky-800/25 bg-sky-800/10 text-sky-950",
  "Interior Design": "border-crimson/25 bg-crimson/10 text-crimson",
  Residential: "border-espresso/20 bg-espresso/[0.08] text-espresso",
  "Eco Design": "border-emerald-800/25 bg-emerald-800/10 text-emerald-900",
  Lighting: "border-amber-700/25 bg-amber-600/10 text-amber-900",
};

function TagPill({
  tag,
  className,
}: {
  tag: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5",
        TAG_STYLES[tag] ?? "border-clay/30 bg-clay/10 text-espresso",
        className
      )}
    >
      {tag}
    </span>
  );
}

export function JournalIndexPage() {
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.journal;
  const featured = getFeaturedPost();
  const rest = journalPosts.filter((p) => p.slug !== featured.slug);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const visible = rest.slice(0, visibleCount);
  const hasMore = visibleCount < rest.length;
  const isExpanded = visibleCount > PAGE_SIZE;

  const showMore = () => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, rest.length));
  };

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <PageShell headerVariant="overlay">
      <PageHero
        eyebrow={journalPage.eyebrow}
        title={[...journalPage.title]}
        description={journalPage.description}
        image={bg.desktop}
        imageTablet={bg.tablet}
        imageMobile={bg.mobile}
      />

      <section className="bg-cream-2 py-16 md:py-24 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal y={40}>
            <Link
              to="/journal/$slug"
              params={{ slug: featured.slug }}
              className="group grid grid-cols-1 overflow-hidden rounded-xl bg-cream md:grid-cols-2"
            >
              <div className="overflow-hidden">
                <motion.img
                  src={featured.image}
                  alt={featured.title}
                  className="aspect-[16/11] h-full w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>
              <div className="flex flex-col p-5 sm:p-6 md:p-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-ink md:text-xs">
                  Featured
                </span>
                <h2 className="font-display mt-3 text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium uppercase leading-[1.05] text-ink md:mt-4">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-ink md:mt-4 md:text-[15px]">
                  {featured.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 text-xs tracking-wide text-muted-ink md:pt-8">
                  <span>{featured.date}</span>
                  <TagPill tag={featured.tag} className="px-3 py-1" />
                </div>
              </div>
            </Link>
          </Reveal>

          <Stagger
            stagger={0.12}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:mt-10 lg:grid-cols-3"
          >
            {visible.map((post) => (
              <StaggerItem key={post.slug} className="group">
                <Link
                  to="/journal/$slug"
                  params={{ slug: post.slug }}
                  className="flex flex-col overflow-hidden rounded-xl"
                >
                  <div className="relative overflow-hidden rounded-xl bg-cream">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="aspect-[16/10] w-full object-cover object-top"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.9, ease: EASE }}
                    />
                    <TagPill
                      tag={post.tag}
                      className="absolute top-3 left-3 z-10"
                    />
                  </div>
                  <div className="flex flex-col pt-3">
                    <h3 className="font-detective flex items-start justify-between gap-2 text-[clamp(1.2rem,2.2vw,1.75rem)] font-medium leading-[1.15] tracking-tighter text-ink">
                      {post.title}
                      <ArrowUpRight className="size-4 shrink-0 translate-y-1 text-muted-ink transition-transform duration-300 group-hover:translate-x-0.5" />
                    </h3>
                    <p className="mt-2 text-[11px] tracking-wide text-muted-ink">
                      {post.date}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          {rest.length > PAGE_SIZE ? (
            <div className="mt-10 flex flex-wrap gap-3">
              {hasMore ? (
                <BrandButton type="button" icon="down" onClick={showMore}>
                  Show more
                </BrandButton>
              ) : null}
              {isExpanded ? (
                <BrandButton
                  type="button"
                  variant="outline-dark"
                  icon="up"
                  onClick={showLess}
                >
                  Show less
                </BrandButton>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
