import { motion } from "motion/react";
import type { Project } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { EASE, LinesReveal, Reveal } from "@/components/anim";

type PdCaseProps = {
  project: Project;
  featured: string[];
};

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.35em] text-[var(--nh-red)]">
      {children}
    </p>
  );
}

function BodyCopy({ children }: { children: string }) {
  return (
    <p className="font-detective mt-5 max-w-xl text-sm leading-relaxed text-white/70 md:text-[15px]">
      {children}
    </p>
  );
}

function FullBleedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Reveal y={36} amount={0.2} className="relative overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.35, ease: EASE }}
      />
    </Reveal>
  );
}

export function PdCase({ project, featured }: PdCaseProps) {
  const [imgA, imgB, imgC, imgClose] = featured;
  const materials = [...project.materials, ...project.finishes].slice(0, 6);

  return (
    <div className="bg-[var(--nh-black)]">
      {/* Challenge — editorial text */}
      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-[7vw]">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionEyebrow>Challenge</SectionEyebrow>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={["The Brief"]}
            className="font-display mt-5 text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.04] text-[var(--nh-white)]"
            delay={0.08}
          />
          <Reveal delay={0.2}>
            <BodyCopy>{project.challenge}</BodyCopy>
          </Reveal>
        </div>
      </section>

      {imgA ? <FullBleedImage src={imgA} alt={`${project.title}, space`} /> : null}

      {/* Approach — split */}
      <section className="grid grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-16 xl:px-20">
          <Reveal>
            <SectionEyebrow>Approach</SectionEyebrow>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={["How We", "Built It"]}
            className="font-display mt-5 max-w-md text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.04] text-[var(--nh-white)]"
            delay={0.08}
          />
          <Reveal delay={0.22}>
            <BodyCopy>{project.approach}</BodyCopy>
          </Reveal>
          {project.scope.length > 0 && (
            <Reveal delay={0.3} className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--nh-muted)]">
                Scope
              </p>
              <ul className="mt-4 space-y-2.5">
                {project.scope.slice(0, 5).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-white/75"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full bg-[var(--nh-red)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        {imgB ? (
          <Reveal y={40} amount={0.2} className="relative min-h-[380px] lg:min-h-full">
            <motion.img
              src={imgB}
              alt={`${project.title}, approach`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            <div className="absolute inset-0 bg-black/15" />
          </Reveal>
        ) : null}
      </section>

      {/* Materials strip */}
      {materials.length > 0 && (
        <section className="border-y border-[var(--nh-line)] px-5 py-10 md:px-10 md:py-12 lg:px-[7vw]">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--nh-muted)]">
              Materials & finishes
            </p>
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-3 md:gap-x-4">
              {materials.map((m) => (
                <span
                  key={m}
                  className="border border-[var(--nh-line)] px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-[var(--nh-white)]"
                >
                  {m}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Narrative body */}
      {project.body.length > 0 && (
        <section className="px-5 py-16 md:px-10 md:py-24 lg:px-[7vw]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionEyebrow>Narrative</SectionEyebrow>
              </Reveal>
              <LinesReveal
                as="h2"
                lines={["In Detail"]}
                className="font-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.04] text-[var(--nh-white)]"
                delay={0.08}
              />
            </div>
            <Reveal delay={0.15} className="space-y-6 lg:col-span-8">
              {project.body.map((para) => (
                <p
                  key={para}
                  className="font-detective max-w-2xl text-sm leading-relaxed text-white/70 md:text-[15px]"
                >
                  {para}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {imgC ? <FullBleedImage src={imgC} alt={`${project.title}, detail`} /> : null}

      {/* Outcome + closing frame */}
      <section className="grid grid-cols-1 overflow-hidden lg:grid-cols-12">
        <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:col-span-5 lg:px-16 xl:px-20">
          <Reveal>
            <SectionEyebrow>Outcome</SectionEyebrow>
          </Reveal>
          <LinesReveal
            as="h2"
            lines={["What Landed"]}
            className="font-display mt-5 text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.04] text-[var(--nh-white)]"
            delay={0.08}
          />
          <Reveal delay={0.2}>
            <BodyCopy>{project.outcome}</BodyCopy>
          </Reveal>
          <Reveal delay={0.32} className="mt-10">
            <BrandButton to="/contact">Start a similar project</BrandButton>
          </Reveal>
        </div>

        {(imgClose || imgC) && (
          <Reveal
            y={40}
            amount={0.15}
            className="relative min-h-[420px] lg:col-span-7 lg:min-h-[560px]"
          >
            <motion.img
              src={imgClose || imgC}
              alt={`${project.title}, outcome`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent lg:from-black/40" />
          </Reveal>
        )}
      </section>

      {/* Credits */}
      {project.credits.length > 0 && (
        <section className="border-t border-[var(--nh-line)] px-5 py-12 md:px-10 md:py-14 lg:px-[7vw]">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--nh-muted)]">
              Credits
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 md:gap-8">
              {project.credits.map((c) => (
                <div key={c.role}>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--nh-muted)]">
                    {c.role}
                  </dt>
                  <dd className="mt-1.5 text-sm text-[var(--nh-white)]">{c.name}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      )}
    </div>
  );
}
