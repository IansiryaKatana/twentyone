import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { listings } from "@/data/content";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

const aspect: Record<string, string> = {
  tall: "aspect-[4/5]",
  short: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

function ListingCard({
  item,
}: {
  item: (typeof listings.items)[number];
}) {
  return (
    <StaggerItem className="group">
      <Link to="/projects/$slug" params={{ slug: item.slug }} className="block">
        <div className="overflow-hidden rounded-lg">
          <motion.img
            src={item.image}
            alt={item.title}
            className={cn("w-full object-cover", aspect[item.span] ?? aspect.short)}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg text-ink transition-colors group-hover:text-clay md:text-xl">
              {item.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs tracking-wide text-muted-ink">
              <MapPin className="size-3" />
              {item.location}
            </p>
          </div>
          <span className="whitespace-nowrap font-display text-base text-ink">
            {item.price}
          </span>
        </div>
      </Link>
    </StaggerItem>
  );
}

export function NewListings() {
  const left = listings.items.filter((_, i) => i % 2 === 0);
  const right = listings.items.filter((_, i) => i % 2 === 1);

  return (
    <section id="listings" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-ink md:col-span-2 md:pt-3">
            {listings.eyebrow}
          </p>
          <div className="md:col-span-10">
            <LinesReveal
              as="h2"
              lines={listings.title}
              className="font-display text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[1.02] text-ink"
            />
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal delay={0.2}>
                <p className="max-w-xl text-sm leading-relaxed text-muted-ink">
                  {listings.body}
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <Link
                  to="/projects"
                  className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-black py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-crimson"
                >
                  {listings.cta}
                  <span className="flex size-8 items-center justify-center rounded-md bg-cream text-ink transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <Stagger stagger={0.15} className="flex flex-col gap-14">
            {left.map((item) => (
              <ListingCard key={item.slug} item={item} />
            ))}
          </Stagger>
          <Stagger
            stagger={0.15}
            delayChildren={0.1}
            className="mt-0 flex flex-col gap-14 md:mt-28"
          >
            {right.map((item) => (
              <ListingCard key={item.slug} item={item} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
