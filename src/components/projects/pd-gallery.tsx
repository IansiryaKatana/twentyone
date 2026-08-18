import { motion } from "motion/react";
import type { Project } from "@/data/content";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

export function PdGallery({
  project,
  images,
}: {
  project: Project;
  images: string[];
}) {
  if (images.length === 0) return null;

  return (
    <section className="bg-[var(--nh-black)] px-5 py-16 md:px-10 md:py-24 lg:px-[7vw]">
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
              Gallery
            </p>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={["Selected Frames"]}
            className="font-display mt-4 text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.04] text-[var(--nh-white)]"
            delay={0.08}
          />
        </div>
        {project.typologies.length > 0 && (
          <Reveal delay={0.15} className="flex flex-wrap gap-2 md:max-w-md md:justify-end">
            {project.typologies.map((t) => (
              <span
                key={t}
                className="text-xs uppercase tracking-[0.2em] text-[var(--nh-muted)]"
              >
                {t}
              </span>
            ))}
          </Reveal>
        )}
      </div>

      <Stagger
        stagger={0.08}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3"
      >
        {images.map((src, i) => {
          const wide = images.length >= 5 && (i === 0 || i === 4);
          return (
            <StaggerItem
              key={`${src}-${i}`}
              className={cn(
                "group relative overflow-hidden",
                wide && "sm:col-span-2 lg:col-span-2",
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  wide ? "aspect-[16/10]" : "aspect-square sm:aspect-[4/5]",
                )}
              >
                <motion.img
                  src={src}
                  alt={`${project.title}, ${String(i + 1).padStart(2, "0")}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="pointer-events-none absolute bottom-4 left-4 font-display text-sm uppercase tracking-tight text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:bottom-5 md:left-5 md:text-base">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
