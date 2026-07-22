import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getServiceCategories, servicesPage } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { EASE, Stagger, StaggerItem } from "@/components/anim";

export function ServicesIndexPage() {
  const categories = getServiceCategories();

  return (
    <PageShell>
      <PageHero
        eyebrow={servicesPage.eyebrow}
        title={[...servicesPage.title]}
        description={servicesPage.description}
      />

      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Stagger
            stagger={0.1}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((cat, i) => (
              <StaggerItem
                key={cat.slug}
                className={i === 0 ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  to="/services/$slug"
                  params={{ slug: cat.slug }}
                  className="group block overflow-hidden rounded-xl bg-cream"
                >
                  <div className="overflow-hidden">
                    <motion.img
                      src={cat.heroImage}
                      alt={cat.label}
                      className="aspect-[16/11] w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-ink">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 className="font-display mt-2 text-2xl font-normal uppercase text-ink">
                        {cat.label}
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-ink">
                        {cat.intro}
                      </p>
                    </div>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-300 group-hover:rotate-45 group-hover:border-crimson group-hover:bg-crimson group-hover:text-cream">
                      <ArrowUpRight className="size-4" />
                    </span>
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
