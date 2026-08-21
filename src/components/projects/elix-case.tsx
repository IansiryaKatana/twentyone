import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { elixCase } from "@/data/elix-case";
import { EASE, LinesReveal, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

const BODY =
  "font-detective text-[1.3125rem] font-medium leading-[1.15] text-white/70 md:text-[1.3875rem]";
const EYEBROW = "text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]";
const DISPLAY =
  "font-display text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.04] text-[var(--nh-white)]";

function MaskedHeroTitle({ lines }: { lines: readonly string[] }) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <h1
      ref={ref}
      className="font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[1.02]"
    >
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={cn(
              "block",
              i === lines.length - 1 ? "text-[var(--nh-red)]" : "text-[var(--nh-white)]",
            )}
            initial={{ y: "115%" }}
            animate={inView ? { y: "0%" } : { y: "115%" }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.12 + i * 0.1 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function FullBleed({
  src,
  alt,
  tall,
}: {
  src: string;
  alt: string;
  tall?: boolean;
}) {
  return (
    <Reveal y={36} amount={0.15} className="relative overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
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

export function ElixCase() {
  const c = elixCase;

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

          <div className="mx-auto mt-10 max-w-4xl text-center md:mt-14">
            <Reveal delay={0.05}>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--nh-muted)]">
                {c.eyebrow}
              </p>
              <p className={cn(EYEBROW, "mt-3")}>{c.tags}</p>
            </Reveal>
            <div className="mt-5 md:mt-7">
              <MaskedHeroTitle lines={c.titleLines} />
            </div>
            <Reveal delay={0.28} className="mx-auto mt-7 max-w-xl md:mt-9">
              <p className={BODY}>{c.intro}</p>
            </Reveal>
          </div>

          <Reveal delay={0.35} className="mt-12 border-t border-[var(--nh-line)] md:mt-16">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 md:py-10">
              {c.facts.map((f) => (
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
        </div>
      </section>

      <FullBleed src={c.images.hero} alt="ELIX Spa treatment room" tall />

      <section className="border-y border-[var(--nh-line)] bg-[var(--nh-black)] px-5 py-12 md:px-10 md:py-16 lg:px-[7vw]">
        <Stagger
          stagger={0.12}
          className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 sm:flex-row sm:gap-16"
        >
          <StaggerItem>
            <img
              src={c.images.award}
              alt="MENA Commercial Interior Design Awards 2024, Highly Commended"
              className="mx-auto h-16 w-auto object-contain md:h-20"
            />
          </StaggerItem>
          <StaggerItem>
            <img
              src={c.images.clientMark}
              alt="The Heart of Europe"
              className="mx-auto h-16 w-auto object-contain md:h-20"
            />
          </StaggerItem>
        </Stagger>
      </section>

      <FullBleed src={c.images.sauna} alt="ELIX Spa sauna" tall />

      <section className="bg-[var(--nh-black)] px-5 py-16 md:px-10 md:py-24 lg:px-[7vw]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Stagger stagger={0.1} className="grid grid-cols-3 gap-3 lg:col-span-5">
            {c.images.concept.map((src, i) => (
              <StaggerItem key={src}>
                <img
                  src={src}
                  alt={`ELIX concept atmosphere ${String(i + 1).padStart(2, "0")}`}
                  className="aspect-[3/4] w-full object-cover"
                />
              </StaggerItem>
            ))}
          </Stagger>
          <div className="lg:col-span-7">
            <Reveal>
              <p className={EYEBROW}>{c.concept.eyebrow}</p>
            </Reveal>
            <LinesReveal
              as="h2"
              lines={[...c.concept.title]}
              className={cn(DISPLAY, "mt-5")}
              delay={0.08}
            />
            <Reveal delay={0.2} className="mt-6">
              <CopyBlock paragraphs={c.concept.paragraphs} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 overflow-hidden bg-[var(--nh-black)] lg:grid-cols-2 lg:min-h-[80vh]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-16 xl:px-20">
          <Reveal>
            <p className={EYEBROW}>{c.direction.eyebrow}</p>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={[...c.direction.title]}
            className={cn(DISPLAY, "mt-5 max-w-md")}
            delay={0.08}
          />
          <Reveal delay={0.2} className="mt-6">
            <CopyBlock paragraphs={c.direction.paragraphs} />
          </Reveal>
        </div>
        <Reveal y={40} amount={0.2} className="relative min-h-[420px] lg:min-h-full">
          <motion.img
            src={c.images.direction}
            alt="ELIX Spa relaxation lounge"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </Reveal>
      </section>

      <section className="grid grid-cols-1 overflow-hidden bg-[var(--nh-black)] lg:grid-cols-2 lg:min-h-[80vh]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-16 xl:px-20">
          <Reveal y={28} className="mb-8 overflow-hidden">
            <img
              src={c.images.treatment}
              alt="ELIX Spa treatment space"
              className="aspect-[16/10] w-full object-cover"
            />
          </Reveal>
          <Reveal>
            <p className={EYEBROW}>{c.treatment.eyebrow}</p>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={[...c.treatment.title]}
            className={cn(DISPLAY, "mt-5")}
            delay={0.08}
          />
          <Reveal delay={0.2} className="mt-6">
            <CopyBlock paragraphs={c.treatment.paragraphs} />
          </Reveal>
        </div>
        <Reveal y={40} amount={0.2} className="relative min-h-[420px] lg:min-h-full">
          <motion.img
            src={c.images.treatmentWide}
            alt="ELIX Spa treatment room detail"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </Reveal>
      </section>

      <FullBleed src={c.images.fullBleedA} alt="ELIX Spa interior" />

      <section className="bg-[var(--nh-black)] px-5 py-16 md:px-10 md:py-24 lg:px-[7vw]">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className={EYEBROW}>{c.entrance.eyebrow}</p>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={[...c.entrance.title]}
            className={cn(DISPLAY, "mt-5")}
            delay={0.08}
          />
          <Reveal delay={0.2} className="mt-6">
            <CopyBlock paragraphs={c.entrance.paragraphs} />
          </Reveal>
        </div>

        <Stagger stagger={0.1} className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          <StaggerItem>
            <img
              src={c.images.soap}
              alt="ELIX branded soap"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
            />
          </StaggerItem>
          <StaggerItem>
            <img
              src={c.images.brand}
              alt="ELIX logotype, Infuse Revelry With Bliss"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
            />
          </StaggerItem>
        </Stagger>

        <Stagger stagger={0.1} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-4 md:gap-4">
          <StaggerItem>
            <img
              src={c.images.entranceA}
              alt="ELIX Spa entrance"
              className="aspect-[4/5] w-full object-cover"
            />
          </StaggerItem>
          <StaggerItem>
            <img
              src={c.images.entranceB}
              alt="ELIX Spa arrival detail"
              className="aspect-[4/5] w-full object-cover"
            />
          </StaggerItem>
        </Stagger>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-2xl">
          <p className={cn(BODY, "text-center")}>{c.entrance.caption}</p>
        </Reveal>

        <Stagger
          stagger={0.1}
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 md:mt-16"
        >
          {c.entrance.rooms.map((room) => (
            <StaggerItem key={room.label}>
              <img
                src={room.src}
                alt={room.label}
                className="aspect-[4/5] w-full object-cover"
              />
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[var(--nh-white)]">
                {room.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <FullBleed src={c.images.fullBleedB} alt="ELIX Spa atmosphere" />

      <section className="grid grid-cols-1 overflow-hidden bg-[var(--nh-black)] lg:grid-cols-2 lg:min-h-[80vh]">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-16 xl:px-20">
          <Reveal>
            <p className={EYEBROW}>{c.experience.eyebrow}</p>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={[...c.experience.title]}
            className={cn(DISPLAY, "mt-5")}
            delay={0.08}
          />
          <Reveal delay={0.2} className="mt-6">
            <CopyBlock paragraphs={c.experience.paragraphs} />
          </Reveal>
        </div>
        <Reveal y={40} amount={0.2} className="relative min-h-[420px] lg:min-h-full">
          <motion.img
            src={c.images.experience}
            alt="ELIX Spa experience"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </Reveal>
      </section>

      <FullBleed src={c.images.fullBleedC} alt="ELIX Spa treatment suite" />

      <section className="bg-[var(--nh-black)] px-5 py-16 md:px-10 md:py-24 lg:px-[7vw]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal y={36} className="lg:col-span-5">
            <img
              src={c.images.review}
              alt={c.review.name}
              className="mx-auto aspect-square w-full max-w-md object-cover lg:max-w-none"
            />
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal>
              <p className={EYEBROW}>{c.review.eyebrow}</p>
            </Reveal>
            <span
              aria-hidden
              className="font-display mt-6 block text-[clamp(5.5rem,14vw,10rem)] leading-[0.7] text-[var(--nh-red)]"
            >
              “
            </span>
            <blockquote className="font-detective -mt-6 max-w-2xl text-[1.3125rem] font-medium leading-[1.15] text-white/80 md:-mt-8 md:text-[1.3875rem]">
              {c.review.quote}
            </blockquote>
            <span
              aria-hidden
              className="font-display mt-4 block text-[clamp(5.5rem,14vw,10rem)] leading-[0.7] text-[var(--nh-red)]"
            >
              ”
            </span>
            <p className="font-display mt-6 text-[clamp(2.22rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-[var(--nh-red)]">
              {c.review.name}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/55">
              {c.review.role}
              <br />
              {c.review.org}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
