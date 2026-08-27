import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { CaseBlock, ProjectCaseStudy } from "@/data/project-case";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

const BODY =
  "font-detective text-[1.3125rem] font-medium leading-[1.15] text-white/70 md:text-[1.3875rem]";
const EYEBROW = "text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]";
const DISPLAY =
  "font-display text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.04] text-[var(--nh-white)]";
const HERO_DISPLAY =
  "font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[1.02]";

function MaskedHeroTitle({ lines }: { lines: readonly string[] }) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const words = lines.join(" ").trim().split(/\s+/).filter(Boolean);
  const last = words.at(-1) ?? "";
  const lead = words.slice(0, -1).join(" ");

  return (
    <h1 ref={ref} className={cn(HERO_DISPLAY, "w-full")}>
      <span className="block overflow-hidden">
        <motion.span
          className="block text-[var(--nh-white)]"
          initial={{ y: "115%" }}
          animate={inView ? { y: "0%" } : { y: "115%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.12 }}
        >
          {lead ? `${lead} ` : null}
          <span className="text-[var(--nh-red)]">{last}</span>
        </motion.span>
      </span>
    </h1>
  );
}

function FullBleed({ src, tall }: { src: string; tall?: boolean }) {
  return (
    <Reveal y={36} amount={0.15} className="relative overflow-hidden">
      <motion.img
        src={src}
        alt=""
        className={cn("w-full object-cover", tall ? "h-screen" : "h-[80vh]")}
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.35, ease: EASE }}
      />
    </Reveal>
  );
}

function CopyBlock({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="space-y-5">
      {paragraphs.map((p) => (
        <p key={p} className={cn(BODY, "max-w-xl")}>
          {p}
        </p>
      ))}
    </div>
  );
}

function SplitImage({ src }: { src: string }) {
  return (
    <Reveal y={40} amount={0.2} className="relative min-h-[420px] lg:min-h-full">
      <motion.img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </Reveal>
  );
}

function CopyHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: readonly string[];
}) {
  return (
    <>
      <Reveal>
        <p className={EYEBROW}>{eyebrow}</p>
      </Reveal>
      <LinesReveal
        as="h2"
        lines={[...title]}
        className={cn(DISPLAY, "mt-5")}
        delay={0.08}
      />
    </>
  );
}

function CaseBlocks({ blocks }: { blocks: readonly CaseBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const key = `${block.type}-${i}`;
        if (block.type === "fullBleed") {
          return <FullBleed key={key} src={block.src} tall={block.tall} />;
        }
        if (block.type === "marks") {
          return (
            <section
              key={key}
              className="bg-[var(--nh-red)] px-5 py-12 md:px-10 md:py-16 lg:px-[7vw]"
            >
              <Stagger
                stagger={0.12}
                className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-12 sm:gap-20"
              >
                {block.srcs.map((src) => (
                  <StaggerItem key={src}>
                    <img
                      src={src}
                      alt=""
                      className="mx-auto h-[6.4rem] w-auto max-w-[352px] object-contain md:h-32"
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        }
        if (block.type === "copy") {
          const images = block.images ?? [];
          const layout =
            block.layout ??
            (images.length >= 3 ? "thumbs-left" : images.length ? "image-right" : "image-below");
          if (layout === "thumbs-left" && images.length > 0) {
            return (
              <section
                key={key}
                className="bg-[var(--nh-black)] py-16 md:py-24"
              >
                <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-0">
                  <Stagger
                    stagger={0.1}
                    className={cn(
                      "grid gap-3 lg:col-span-5",
                      images.length >= 3 ? "grid-cols-3" : "grid-cols-2",
                    )}
                  >
                    {images.map((src) => (
                      <StaggerItem key={src}>
                        <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
                      </StaggerItem>
                    ))}
                  </Stagger>
                  <div className="px-5 md:px-10 lg:col-span-7 lg:px-14">
                    <CopyHeader eyebrow={block.eyebrow} title={block.title} />
                    <Reveal delay={0.2} className="mt-6">
                      <CopyBlock paragraphs={block.paragraphs} />
                    </Reveal>
                  </div>
                </div>
              </section>
            );
          }
          if (layout === "image-right" && images[0]) {
            const aside = images[1] ?? images[0];
            const lead = images[1] ? images[0] : null;
            return (
              <section
                key={key}
                className="grid grid-cols-1 overflow-hidden bg-[var(--nh-black)] lg:grid-cols-2 lg:min-h-[80vh]"
              >
                <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-16 xl:px-20">
                  {lead ? (
                    <Reveal y={28} className="mb-8 overflow-hidden">
                      <img src={lead} alt="" className="aspect-[16/10] w-full object-cover" />
                    </Reveal>
                  ) : null}
                  <CopyHeader eyebrow={block.eyebrow} title={block.title} />
                  <Reveal delay={0.2} className="mt-6">
                    <CopyBlock paragraphs={block.paragraphs} />
                  </Reveal>
                </div>
                <SplitImage src={aside} />
              </section>
            );
          }
          return (
            <section
              key={key}
              className="bg-[var(--nh-black)] py-16 md:py-24"
            >
              <div className="px-5 md:px-10">
                <CopyHeader eyebrow={block.eyebrow} title={block.title} />
                <Reveal delay={0.2} className="mt-6">
                  <CopyBlock paragraphs={block.paragraphs} />
                </Reveal>
              </div>
              {images.length > 0 ? (
                <Stagger
                  stagger={0.1}
                  className={cn(
                    "mt-12 grid w-full grid-cols-1 gap-3 md:gap-4",
                    images.length === 1 ? "lg:grid-cols-1" : "sm:grid-cols-2",
                  )}
                >
                  {images.map((src) => (
                    <StaggerItem key={src}>
                      <img src={src} alt="" className="aspect-[16/10] w-full object-cover" />
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : null}
            </section>
          );
        }
        if (block.type === "gallery") {
          const cols = block.columns ?? (block.srcs.length % 3 === 0 ? 3 : 2);
          return (
            <section
              key={key}
              className="bg-[var(--nh-black)] pb-16 md:pb-24"
            >
              <Stagger
                stagger={0.1}
                className={cn(
                  "grid w-full grid-cols-1 gap-3 md:gap-4",
                  cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
                )}
              >
                {block.srcs.map((src) => (
                  <StaggerItem key={src}>
                    <img
                      src={src}
                      alt=""
                      className="aspect-[4/5] w-full object-cover sm:aspect-[16/10]"
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        }
        if (block.type === "caption") {
          return (
            <Reveal key={key} className="bg-[var(--nh-black)] px-5 md:px-10 lg:px-[7vw]">
              <p className={cn(BODY, "mx-auto max-w-2xl py-8 text-center")}>{block.text}</p>
            </Reveal>
          );
        }
        if (block.type === "labeled") {
          return (
            <section
              key={key}
              className="bg-[var(--nh-black)] py-14 md:py-16"
            >
              <Stagger
                stagger={0.1}
                className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5"
              >
                {block.items.map((item) => (
                  <StaggerItem key={item.label + item.src}>
                    <img src={item.src} alt={item.label} className="aspect-[4/5] w-full object-cover" />
                    <p className="mt-4 px-5 text-xs uppercase tracking-[0.22em] text-[var(--nh-white)] md:px-6">
                      {item.label}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        }
        if (block.type === "review") {
          return (
            <section
              key={key}
              className="bg-[var(--nh-black)] py-16 md:py-24"
            >
              <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-0">
                {block.image ? (
                  <Reveal y={36} className="lg:col-span-5">
                    <img
                      src={block.image}
                      alt={block.name}
                      className="aspect-square w-full object-cover"
                    />
                  </Reveal>
                ) : null}
                <div className={block.image ? "px-5 md:px-10 lg:col-span-7 lg:px-14" : "px-5 md:px-10 lg:col-span-12"}>
                  <Reveal>
                    <p className={EYEBROW}>Client Review</p>
                  </Reveal>
                  <span
                    aria-hidden
                    className="font-display mt-6 block text-[clamp(5.5rem,14vw,10rem)] leading-[0.7] text-[var(--nh-red)]"
                  >
                    “
                  </span>
                  <blockquote className="font-detective -mt-6 max-w-2xl text-[1.3125rem] font-medium leading-[1.15] text-white/80 md:-mt-8 md:text-[1.3875rem]">
                    {block.quote}
                  </blockquote>
                  <span
                    aria-hidden
                    className="font-display mt-4 block text-[clamp(5.5rem,14vw,10rem)] leading-[0.7] text-[var(--nh-red)]"
                  >
                    ”
                  </span>
                  <p className="font-display mt-6 text-[clamp(2.22rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-[var(--nh-red)]">
                    {block.name}
                  </p>
                  {block.role || block.org ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      {block.role}
                      {block.role && block.org ? <br /> : null}
                      {block.org}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}
    </>
  );
}

export function ProjectCaseView({ study }: { study: ProjectCaseStudy }) {
  return (
    <>
      <section className="bg-[var(--nh-black)] pt-28 md:pt-36">
        <div className="px-5 md:px-10 lg:px-[7vw]">
          <Reveal className="flex justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--nh-muted)] transition-colors hover:text-[var(--nh-white)]"
            >
              <ArrowLeft className="size-3.5" />
              All projects
            </Link>
          </Reveal>

          <div className="mt-10 w-full text-center md:mt-14">
            <Reveal delay={0.05}>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--nh-muted)]">
                {study.eyebrow}
              </p>
              {study.tags ? <p className={cn(EYEBROW, "mt-3")}>{study.tags}</p> : null}
            </Reveal>
            <div className="mt-5 w-full md:mt-7">
              <MaskedHeroTitle lines={study.titleLines} />
            </div>
            {study.intro ? (
              <Reveal delay={0.28} className="mt-7 w-full md:mt-9">
                <p className={BODY}>{study.intro}</p>
              </Reveal>
            ) : null}
          </div>

          {study.facts.length > 0 ? (
            <Reveal delay={0.35} className="mt-12 border-t border-[var(--nh-line)] md:mt-16">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 md:py-10">
                {study.facts.map((f) => (
                  <div key={f.label} className="min-w-0 text-left">
                    <dt className="font-display text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.04] text-[var(--nh-white)]">
                      {f.label}
                    </dt>
                    <dd className="font-detective mt-3 text-[1.3125rem] font-medium leading-[1.15] text-white/70 md:text-[1.3875rem]">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </section>
      <CaseBlocks blocks={study.blocks} />
    </>
  );
}
