import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { faqPage } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero, PillCta } from "@/components/page-hero";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = React.useState(0);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <div
            key={item.q}
            className="border-b border-line/70 first:border-t"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="flex w-full items-start gap-4 py-5 text-left"
            >
              <span className="mt-1 text-xs tabular-nums text-muted-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "font-display flex-1 text-lg transition-colors md:text-xl",
                  isOpen ? "text-ink" : "text-ink/70"
                )}
              >
                {item.q}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pl-10 text-sm leading-relaxed text-muted-ink md:pl-12">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function FaqPage() {
  const [category, setCategory] = React.useState(0);
  const active = faqPage.categories[category];

  return (
    <PageShell>
      <PageHero
        eyebrow={faqPage.eyebrow}
        title={faqPage.title}
        description={faqPage.description}
      />

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10 lg:gap-16">
          {/* Category tabs */}
          <div className="md:col-span-4">
            <Stagger stagger={0.08} className="flex flex-col gap-1">
              {faqPage.categories.map((cat, i) => (
                <StaggerItem key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setCategory(i)}
                    className={cn(
                      "group relative w-fit py-2 text-left text-lg transition-colors md:text-xl",
                      i === category
                        ? "text-ink"
                        : "text-muted-ink/70 hover:text-ink"
                    )}
                  >
                    <span className="relative">
                      {cat.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-500",
                          i === category ? "w-full" : "w-0 group-hover:w-1/3"
                        )}
                      />
                    </span>
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Accordion */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <FaqAccordion items={active.items} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Bottom CTA band */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center md:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal uppercase leading-[1.05] text-ink">
              {faqPage.ctaLabel}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <PillCta to="/contact">{faqPage.ctaButton}</PillCta>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
