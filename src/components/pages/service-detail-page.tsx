import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { getService } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PillCta } from "@/components/page-hero";
import { EASE, LinesReveal, Reveal } from "@/components/anim";
import { cn } from "@/lib/utils";

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = getService(slug);
  const [open, setOpen] = React.useState(0);

  if (!service) {
    return (
      <PageShell>
        <section className="bg-cream px-5 pb-28 pt-36 md:px-10">
          <div className="mx-auto max-w-[1440px]">
            <h1 className="font-display text-4xl uppercase text-ink">
              Service not found
            </h1>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-ink hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              Back to services
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="bg-cream pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Link
            to="/services"
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-ink transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            All services
          </Link>
          <LinesReveal
            as="h1"
            lines={[service.label]}
            className="font-display max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[0.95] text-ink"
          />
          <Reveal delay={0.2} className="mt-6 max-w-xl">
            <p className="text-sm leading-relaxed text-muted-ink md:text-base">
              {service.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream pb-10 md:pb-14">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <div className="overflow-hidden rounded-lg">
              <img
                src={service.heroImage}
                alt={service.label}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-ink">
              Capabilities
            </p>
            <Reveal delay={0.1} className="mt-8">
              <PillCta to="/contact">Discuss This Service</PillCta>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            {service.items.map((item, i) => {
              const isOpen = i === open;
              return (
                <div
                  key={item.title}
                  className="border-b border-line/70 first:border-t"
                >
                  <button
                    type="button"
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
                        transition={{ duration: 0.55, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6">
                          {"image" in item && item.image && (
                            <div className="overflow-hidden rounded-md">
                              <motion.img
                                key={item.image}
                                src={item.image}
                                alt={item.title}
                                initial={{
                                  scale: 1.12,
                                  clipPath: "inset(0 0 100% 0)",
                                }}
                                animate={{
                                  scale: 1,
                                  clipPath: "inset(0 0 0% 0)",
                                }}
                                transition={{ duration: 0.85, ease: EASE }}
                                className="aspect-[16/9] w-full object-cover"
                              />
                            </div>
                          )}
                          {"description" in item && item.description && (
                            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-ink">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
