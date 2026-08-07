import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, MapPin, Pause, Play } from "lucide-react";
import { showcase } from "@/data/content";
import { EASE } from "@/components/anim";

const DURATION = 6000;

export function Showcase() {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const count = showcase.length;

  const go = React.useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );
  const goTo = (i: number) => setIndex(i);

  React.useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(1), DURATION);
    return () => clearTimeout(t);
  }, [index, playing, go]);

  const active = showcase[index];
  const next = showcase[(index + 1) % count];

  return (
    <section
      id="showcase"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      {/* Background slides — clip-wipe reveal */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.img
            src={active.image}
            alt={active.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
        <div className="flex items-end justify-between gap-6">
          {/* Info card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="max-w-md rounded-xl bg-cream/95 p-6 backdrop-blur-sm md:p-7"
            >
              <h3 className="font-display text-2xl font-medium text-ink md:text-3xl">
                {active.title}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs tracking-wide text-muted-ink">
                <MapPin className="size-3.5" />
                {active.location}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-ink">
                {active.description}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Previous"
                    onClick={() => go(-1)}
                    className="flex size-9 items-center justify-center rounded-md border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-cream"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <button
                    aria-label="Next"
                    onClick={() => go(1)}
                    className="flex size-9 items-center justify-center rounded-md border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-cream"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                  <button
                    aria-label={playing ? "Pause" : "Play"}
                    onClick={() => setPlaying((p) => !p)}
                    className="ml-1 flex size-9 items-center justify-center rounded-md bg-ink text-cream transition-colors hover:bg-crimson"
                  >
                    {playing ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </button>
                </div>
                <span className="font-display text-lg text-ink">
                  {active.price}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating preview of the next slide */}
          <button
            onClick={() => go(1)}
            className="group relative hidden h-40 w-56 shrink-0 overflow-hidden rounded-lg border border-cream/20 shadow-2xl md:block"
          >
            <span className="absolute left-3 top-3 z-10 rounded-full bg-cream/90 px-3 py-1 text-[10px] uppercase tracking-widest text-ink">
              {active.previewLabel}
            </span>
            <AnimatePresence mode="popLayout">
              <motion.img
                key={next.preview}
                src={next.preview}
                alt={next.title}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </AnimatePresence>
          </button>
        </div>

        {/* Progress dots */}
        <div className="mt-8 flex items-center gap-2">
          {showcase.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="group relative h-1 overflow-hidden rounded-full bg-cream/25 transition-all duration-500"
              style={{ width: i === index ? 44 : 20 }}
            >
              {i === index && playing && (
                <motion.span
                  key={index}
                  className="absolute inset-0 origin-left bg-cream"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              )}
              {i === index && !playing && (
                <span className="absolute inset-0 bg-cream" />
              )}
            </button>
          ))}
          <span className="ml-3 font-display text-sm text-cream/70">
            {String(index + 1).padStart(2, "0")}
            <span className="text-cream/40">
              {" "}
              / {String(count).padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
