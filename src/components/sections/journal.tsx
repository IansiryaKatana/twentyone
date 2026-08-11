import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { journal } from "@/data/content";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";

export function Journal() {
  return (
    <section id="journal" className="scroll-mt-24 bg-cream-2 py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <LinesReveal
            as="h2"
            lines={journal.title}
            className="font-display max-w-3xl text-[clamp(1.75rem,4vw,3.4rem)] font-medium leading-[1.05] text-ink"
          />
          <div className="md:pb-2">
            <Reveal delay={0.15}>
              <p className="max-w-xs text-sm leading-relaxed text-muted-ink">
                {journal.body}
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-5">
              <Link
                to="/journal"
                className="group inline-flex items-center gap-2 rounded-md bg-black py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-crimson"
              >
                {journal.cta}
                <span className="flex size-8 items-center justify-center rounded-md bg-cream text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal y={40} className="group">
            <Link
              to="/journal/$slug"
              params={{ slug: journal.featured.slug }}
              className="flex h-full flex-col overflow-hidden rounded-xl bg-cream"
            >
              <div className="overflow-hidden">
                <motion.img
                  src={journal.featured.image}
                  alt={journal.featured.title}
                  className="aspect-[16/11] w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium uppercase leading-[1.05] text-ink">
                  {journal.featured.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-ink md:text-[15px]">
                  {journal.featured.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-8 text-xs tracking-wide text-muted-ink">
                  <span>{journal.featured.date}</span>
                  <span className="rounded-full border border-line px-3 py-1">
                    {journal.featured.tag}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          <Stagger stagger={0.15} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {journal.posts.map((post) => (
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
                    <h3 className="font-display flex items-start justify-between gap-2 text-[clamp(1.15rem,2vw,1.5rem)] font-medium uppercase leading-[1.05] text-ink">
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
      </div>
    </section>
  );
}
