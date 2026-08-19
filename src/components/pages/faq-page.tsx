import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type FaqItem, faqPage } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { EASE, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = React.useState(0);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <div
            key={item.q}
            className="border-b border-white/25 first:border-t"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-3 py-4 text-left md:gap-4 md:py-5"
            >
              <span className="mt-1 text-[0.65rem] tabular-nums text-white/45 md:mt-1.5 md:text-xs">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "font-detective flex-1 text-[clamp(1rem,2.24vw,1.88rem)] font-medium leading-[1.12] tracking-tighter normal-case transition-colors",
                  isOpen ? "text-white" : "text-white/75"
                )}
              >
                {item.q}
              </span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "mt-1 size-4 shrink-0 text-white/50 transition-transform duration-300 md:mt-1.5 md:size-5",
                  isOpen && "rotate-180 text-white"
                )}
              />
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
                  <div className="max-w-2xl space-y-3 pb-5 pl-9 md:pl-11">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-white/80 md:text-[15px]">
                      {item.a}
                    </p>
                    {item.link ? (
                      <Link
                        to={item.link.to}
                        className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-70"
                      >
                        {item.link.label}
                        <span aria-hidden>→</span>
                      </Link>
                    ) : null}
                  </div>
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
  const { faqCategories, sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.faq;
  const categories =
    faqCategories.length > 0
      ? faqCategories
      : faqPage.categories.map((cat) => ({
          id: cat.id,
          label: cat.label,
          items: cat.items,
        }));
  const [category, setCategory] = React.useState(0);
  const active = categories[category] ?? categories[0];

  return (
    <PageShell headerVariant="overlay">
      <PageHero
        eyebrow={faqPage.eyebrow}
        title={faqPage.title}
        description={faqPage.description}
        descriptionClassName="text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-[1.15]"
        image={bg.desktop}
        imageTablet={bg.tablet}
        imageMobile={bg.mobile}
      />

      <section className="bg-crimson py-16 md:py-24 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 md:grid-cols-12 md:gap-12 md:px-10 lg:gap-16">
          <div className="md:col-span-4">
            <Stagger stagger={0.08} className="flex flex-col gap-0.5">
              {categories.map((cat, i) => (
                <StaggerItem key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setCategory(i)}
                    className={cn(
                      "group relative w-fit py-2 text-left font-sans text-[clamp(1rem,1.8vw,1.25rem)] font-light leading-[1.3] tracking-normal transition-colors",
                      i === category
                        ? "text-white"
                        : "text-white/55 hover:text-white"
                    )}
                  >
                    <span className="relative">
                      {cat.label}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px bg-white transition-all duration-500",
                          i === category ? "w-full" : "w-0 group-hover:w-1/3"
                        )}
                      />
                    </span>
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

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
    </PageShell>
  );
}
