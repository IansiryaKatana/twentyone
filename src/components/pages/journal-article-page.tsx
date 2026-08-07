import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { type JournalPost } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PillCta } from "@/components/page-hero";
import { LinesReveal, Reveal } from "@/components/anim";

export function JournalArticlePage({ post }: { post: JournalPost }) {
  return (
    <PageShell>
      <article>
        <section className="bg-cream pt-28 pb-10 md:pt-36 md:pb-14">
          <div className="mx-auto max-w-[900px] px-5 md:px-10">
            <Link
              to="/journal"
              className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-ink transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-3.5" />
              Our Blogs
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-wide text-muted-ink">
              <span>{post.date}</span>
              <span className="rounded-full border border-line px-3 py-1">
                {post.tag}
              </span>
            </div>
            <LinesReveal
              as="h1"
              lines={[post.title]}
              className="font-display mt-5 text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[0.95] tracking-tighter text-ink"
            />
            <Reveal delay={0.15} className="mt-6">
              <p className="text-sm leading-relaxed text-muted-ink md:text-[15px]">
                {post.excerpt}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream pb-12 md:pb-16">
          <div className="mx-auto max-w-[1100px] px-5 md:px-10">
            <Reveal>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream-2 py-16 md:py-24">
          <div className="mx-auto max-w-[720px] space-y-5 px-5 md:px-10">
            {post.body.map((para) => (
              <Reveal key={para}>
                <p className="text-sm leading-relaxed text-muted-ink md:text-[15px]">
                  {para}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.1} className="pt-8">
              <PillCta to="/contact">Let's Talk</PillCta>
            </Reveal>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
