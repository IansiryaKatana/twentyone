import * as React from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/data/content";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { cn } from "@/lib/utils";

type ProjectSlide = {
  slug: string;
  title: string;
  thumb: string;
  images: string[];
};

function uniqueImages(...sources: Array<string | string[] | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const source of sources) {
    const list = Array.isArray(source) ? source : source ? [source] : [];
    for (const raw of list) {
      const path = raw?.trim();
      if (!path || seen.has(path)) continue;
      seen.add(path);
      out.push(path);
    }
  }
  return out;
}

function prefetchUrls(urls: string[]) {
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.src = url;
  }
}

export function ServiceProjectCarousel({
  projects,
  fallbackImage,
  fallbackAlt,
}: {
  projects: Project[];
  fallbackImage: string;
  fallbackAlt: string;
}) {
  const reduced = useReducedMotionSafe();
  const [projectIndex, setProjectIndex] = React.useState(0);
  const [imageIndex, setImageIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const thumbRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const projectIndexRef = React.useRef(0);
  const imageIndexRef = React.useRef(0);

  const slides: ProjectSlide[] = React.useMemo(() => {
    const fromProjects = projects
      .map((project) => {
        const images = uniqueImages(project.hero, project.gallery);
        if (images.length === 0) return null;
        return {
          slug: project.slug,
          title: project.title,
          thumb: project.hero?.trim() || images[0],
          images,
        } satisfies ProjectSlide;
      })
      .filter((slide): slide is ProjectSlide => slide !== null);

    if (fromProjects.length > 0) return fromProjects;
    if (fallbackImage.trim()) {
      return [
        {
          slug: "",
          title: fallbackAlt,
          thumb: fallbackImage,
          images: [fallbackImage],
        },
      ];
    }
    return [];
  }, [projects, fallbackImage, fallbackAlt]);

  projectIndexRef.current = projectIndex;
  imageIndexRef.current = imageIndex;

  React.useEffect(() => {
    setProjectIndex((current) =>
      Math.min(current, Math.max(slides.length - 1, 0)),
    );
  }, [slides.length]);

  React.useEffect(() => {
    const active = slides[projectIndex];
    if (!active) {
      setImageIndex(0);
      return;
    }
    setImageIndex((current) =>
      Math.min(current, Math.max(active.images.length - 1, 0)),
    );
  }, [slides, projectIndex]);

  const canAutoplay = React.useMemo(() => {
    if (slides.length > 1) return true;
    return (slides[0]?.images.length ?? 0) > 1;
  }, [slides]);

  React.useEffect(() => {
    if (paused || reduced || !canAutoplay) return;
    const timer = window.setInterval(() => {
      const currentProject = projectIndexRef.current;
      const currentImage = imageIndexRef.current;
      const active = slides[currentProject];
      if (!active) return;

      if (currentImage + 1 < active.images.length) {
        setImageIndex(currentImage + 1);
        return;
      }

      setImageIndex(0);
      if (slides.length > 1) {
        setProjectIndex((currentProject + 1) % slides.length);
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reduced, canAutoplay, slides]);

  React.useEffect(() => {
    if (slides.length === 0) return;
    const active = slides[projectIndex];
    const neighbor = slides[(projectIndex + 1) % slides.length];
    prefetchUrls([
      ...(active?.images ?? []),
      ...(neighbor && neighbor !== active ? neighbor.images : []),
    ]);
  }, [slides, projectIndex]);

  React.useEffect(() => {
    const thumb = thumbRefs.current[projectIndex];
    if (!thumb) return;
    thumb.scrollIntoView({
      inline: "nearest",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [projectIndex, reduced]);

  if (slides.length === 0) return null;

  const active = slides[projectIndex] ?? slides[0];
  const activeImage = active.images[imageIndex] ?? active.images[0];
  const showThumbs = slides.length > 1;

  return (
    <div
      className="relative aspect-[4/5] h-full overflow-hidden rounded-md md:aspect-auto md:rounded-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${active.slug || active.thumb}-${activeImage}`}
          className="absolute inset-0"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          transition={{ duration: reduced ? 0.15 : 0.7, ease: EASE }}
        >
          {active.slug ? (
            <Link
              to="/projects/$slug"
              params={{ slug: active.slug }}
              className="block size-full"
              aria-label={`View project ${active.title}`}
            >
              <img
                src={activeImage}
                alt={active.title}
                className="size-full object-cover"
              />
            </Link>
          ) : (
            <img
              src={activeImage}
              alt={fallbackAlt}
              className="size-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showThumbs ? (
        <div className="absolute top-4 left-4 z-10 md:top-6 md:left-6">
          <div className="flex max-w-[7.75rem] gap-2 overflow-x-auto md:max-w-[8.75rem] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((slide, thumbIndex) => {
              const selected = thumbIndex === projectIndex;
              return (
                <button
                  key={slide.slug || slide.thumb}
                  ref={(node) => {
                    thumbRefs.current[thumbIndex] = node;
                  }}
                  type="button"
                  onClick={() => {
                    setProjectIndex(thumbIndex);
                    setImageIndex(0);
                  }}
                  aria-label={`Show ${slide.title}`}
                  aria-pressed={selected}
                  className={cn(
                    "aspect-square size-14 shrink-0 overflow-hidden rounded-sm bg-black/30 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[transform,border-color,opacity] duration-300 hover:scale-[1.03] md:size-16",
                    selected
                      ? "border border-white opacity-100"
                      : "border border-white/40 opacity-85",
                  )}
                >
                  <img
                    src={slide.thumb}
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
