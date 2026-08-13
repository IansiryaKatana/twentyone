import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { services } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { EASE, LinesReveal, Reveal } from "@/components/anim";
import { cn } from "@/lib/utils";

export function Services() {
  const [tab, setTab] = React.useState(0);
  const [open, setOpen] = React.useState(0);
  const activeTab = services.tabs[tab];

  const selectTab = (i: number) => {
    setTab(i);
    setOpen(0);
  };

  return (
    <section id="services" className="scroll-mt-24 bg-cream-2 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-2 md:px-10 lg:gap-20">
        {/* Left — title + vertical tabs */}
        <div className="flex flex-col">
          <LinesReveal
            as="h2"
            lines={services.title}
            className="font-display text-[clamp(2rem,4vw,3.4rem)] font-medium leading-[1] text-ink"
          />

          <div className="mt-10 flex flex-col gap-1 md:mt-16">
            {services.tabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => selectTab(i)}
                className={cn(
                  "group relative w-fit py-2 text-left text-lg transition-colors md:text-xl",
                  i === tab ? "text-ink" : "text-muted-ink/70 hover:text-ink"
                )}
              >
                <span className="relative">
                  {t.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-500",
                      i === tab ? "w-full" : "w-0 group-hover:w-1/3"
                    )}
                  />
                </span>
              </button>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10 md:mt-auto md:pt-14">
            <BrandButton to="/services" variant="black">
              {services.cta}
            </BrandButton>
          </Reveal>
        </div>

        {/* Right — accordion list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col"
          >
            {activeTab.items.map((item, i) => {
              const isOpen = i === open;
              return (
                <div
                  key={item.title}
                  className="border-b border-line/70 first:border-t"
                >
                  <button
                    onClick={() => setOpen(i)}
                    className="flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className="text-xs tabular-nums text-muted-ink">
                      {item.index}
                    </span>
                    <span
                      className={cn(
                        "font-display text-lg transition-colors md:text-xl",
                        isOpen ? "text-ink" : "text-ink/70"
                      )}
                    >
                      {item.title}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6">
                          <div className="overflow-hidden rounded-md">
                            <motion.img
                              key={item.image}
                              src={item.image}
                              alt={item.title}
                              initial={{ scale: 1.15, clipPath: "inset(0 0 100% 0)" }}
                              animate={{ scale: 1, clipPath: "inset(0 0 0% 0)" }}
                              transition={{ duration: 0.9, ease: EASE }}
                              className="aspect-[16/9] w-full object-cover"
                            />
                          </div>
                          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-ink">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
