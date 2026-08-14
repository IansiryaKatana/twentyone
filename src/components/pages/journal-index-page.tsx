import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { journalPage } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { BrandButton } from "@/components/brand-button";
import { JournalCard } from "@/components/journal-card";
import { Stagger, StaggerItem } from "@/components/anim";
import { useCmsContent } from "@/hooks/useCmsContent";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

function matchesQuery(haystack: string, query: string) {
  if (!query.trim()) return true;
  return haystack.toLowerCase().includes(query.trim().toLowerCase());
}

export function JournalIndexPage() {
  const { sectionBackgrounds, journalPosts } = useCmsContent();
  const bg = sectionBackgrounds.journal;
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const categories = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of journalPosts) {
      counts.set(post.tag, (counts.get(post.tag) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [journalPosts]);

  const filtered = React.useMemo(() => {
    return journalPosts.filter((post) => {
      if (activeTag && post.tag !== activeTag) return false;
      return matchesQuery(
        `${post.title} ${post.excerpt} ${post.tag} ${post.date}`,
        query
      );
    });
  }, [journalPosts, activeTag, query]);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, activeTag]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const isExpanded = visibleCount > PAGE_SIZE;
  const hasActive = Boolean(query.trim()) || Boolean(activeTag);
  const recent = journalPosts.slice(0, 3);

  const showMore = () => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, filtered.length));
  };

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setQuery("");
    setActiveTag(null);
  };

  return (
    <PageShell headerVariant="overlay">
      <PageHero
        breadcrumb={journalPage.breadcrumb}
        title={[...journalPage.title]}
        image={bg.desktop}
        imageTablet={bg.tablet}
        imageMobile={bg.mobile}
      />

      <section className="bg-white py-16 text-[var(--nh-black)] md:py-24 lg:py-28">
        <div className="w-full px-5 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-14 xl:gap-16">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative">
                <label htmlFor="journal-search" className="sr-only">
                  Search blogs
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-black/35"
                  aria-hidden
                />
                <input
                  id="journal-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  className="w-full border-0 border-b border-black/15 bg-transparent py-3 pr-8 pl-7 text-sm text-[var(--nh-black)] outline-none transition-colors placeholder:text-black/40 focus:border-[var(--nh-black)]"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-0 -translate-y-1/2 text-black/40 transition-colors hover:text-[var(--nh-black)]"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>

              <div className="mt-10 border-t border-black/10 pt-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                  Categories
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-y-2.5">
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveTag(null)}
                      className={cn(
                        "text-left text-sm leading-relaxed transition-colors",
                        activeTag === null
                          ? "text-[var(--nh-red)]"
                          : "text-black/70 hover:text-[var(--nh-black)]"
                      )}
                    >
                      All
                      <span className="ml-2 text-[11px] tracking-[0.08em] text-black/35">
                        {journalPosts.length}
                      </span>
                    </button>
                  </li>
                  {categories.map(([tag, count]) => (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTag((current) => (current === tag ? null : tag))
                        }
                        className={cn(
                          "text-left text-sm leading-relaxed transition-colors",
                          activeTag === tag
                            ? "text-[var(--nh-red)]"
                            : "text-black/70 hover:text-[var(--nh-black)]"
                        )}
                      >
                        {tag}
                        <span className="ml-2 text-[11px] tracking-[0.08em] text-black/35">
                          {count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {hasActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--nh-red)] transition-colors hover:text-[var(--nh-black)]"
                >
                  <X className="size-3" />
                  Clear filters
                </button>
              ) : null}

              {recent.length > 0 ? (
                <div className="mt-10 hidden border-t border-black/10 pt-8 lg:block">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                    Recent
                  </p>
                  <ul className="mt-5 flex flex-col gap-5">
                    {recent.map((post) => (
                      <li key={post.slug}>
                        <Link
                          to="/journal/$slug"
                          params={{ slug: post.slug }}
                          className="group grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3"
                        >
                          <div className="overflow-hidden bg-[#f2f2f2]">
                            <img
                              src={post.image}
                              alt=""
                              className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--nh-red)]">
                              {post.date}
                            </p>
                            <p className="font-detective mt-1 line-clamp-2 text-[15px] leading-[1.2] text-[var(--nh-black)] transition-colors group-hover:text-[var(--nh-red)]">
                              {post.title}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>

            <div>
              <p className="mb-8 text-[11px] uppercase tracking-[0.22em] text-black/45">
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              </p>

              {filtered.length === 0 ? (
                <p className="text-sm leading-relaxed text-black/55">
                  No articles match these filters.{" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[var(--nh-red)] underline"
                  >
                    Clear filters
                  </button>
                  .
                </p>
              ) : (
                <Stagger
                  stagger={0.1}
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                >
                  {visible.map((post) => (
                    <StaggerItem key={post.slug}>
                      <JournalCard post={post} />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}

              {filtered.length > PAGE_SIZE ? (
                <div className="mt-10 flex flex-wrap gap-3 md:mt-14">
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
          </div>
        </div>
      </section>
    </PageShell>
  );
}
