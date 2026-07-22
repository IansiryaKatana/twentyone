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
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/anim";

export function JournalIndexPage() {
  const featured = getFeaturedPost();
  const rest = journalPosts.filter((p) => p.slug !== featured.slug);

  return (
    <PageShell>
      <PageHero
        eyebrow={journalPage.eyebrow}
        title={[...journalPage.title]}
        description={journalPage.description}
      />

      <section className="bg-cream-2 py-20 md:py-28">
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
              <div className="flex flex-col p-6 md:p-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-ink">
                  Featured
                </span>
                <h2 className="font-display mt-4 text-2xl font-normal uppercase leading-tight text-ink md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-ink">
                  {featured.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-8 text-xs tracking-wide text-muted-ink">
                  <span>{featured.date}</span>
                  <span className="rounded-full border border-line px-3 py-1">
                    {featured.tag}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          <Stagger
            stagger={0.12}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((post) => (
              <StaggerItem key={post.slug} className="group">
                <Link
                  to="/journal/$slug"
                  params={{ slug: post.slug }}
                  className="flex h-full flex-col overflow-hidden rounded-xl bg-cream"
                >
                  <div className="overflow-hidden">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="aspect-[4/3] w-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.9, ease: EASE }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display flex items-start justify-between gap-2 text-lg font-normal uppercase leading-snug text-ink">
                      {post.title}
                      <ArrowUpRight className="size-4 shrink-0 translate-y-1 text-muted-ink transition-transform duration-300 group-hover:translate-x-0.5" />
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-8 text-[11px] tracking-wide text-muted-ink">
                      <span>{post.date}</span>
                      <span className="rounded-full border border-line px-2.5 py-0.5">
                        {post.tag}
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </PageShell>
  );
}
