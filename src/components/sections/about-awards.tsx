import { useState } from "react";
import { motion } from "motion/react";
import { aboutPage, type Award, type AwardStatus } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { useCmsContent } from "@/hooks/useCmsContent";
import { EASE, Reveal, useReducedMotionSafe } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";

const PAGE_SIZE = 6;

const STATUS_META: Record<
  AwardStatus,
  { label: string; className: string }
> = {
  winner: {
    label: "Winner",
    className: "bg-[var(--nh-red)] text-white",
  },
  highly_commended: {
    label: "Highly Commended",
    className: "bg-white/15 text-white",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border border-white/35 text-white/85",
  },
  editorial: {
    label: "Editorial",
    className: "bg-white text-[var(--nh-black)]",
  },
};

function StatusTag({ status }: { status: AwardStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex w-fit shrink-0 self-start items-center rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function AwardRow({
  award,
  index,
  reduced,
}: {
  award: Award;
  index: number;
  reduced: boolean;
}) {
  const delay = reduced ? 0 : (index % PAGE_SIZE) * 0.08;

  return (
    <motion.li
      className="flex flex-col gap-3 border-b border-white/25 py-5 first:border-t first:border-white/25 md:flex-row md:items-center md:gap-6 md:py-6"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      <StatusTag status={award.status} />
      <p className="font-detective min-w-0 flex-1 text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.25] text-white normal-case">
        {award.title}
      </p>
    </motion.li>
  );
}

export function AboutAwardsSection() {
  const { awards } = useCmsContent();
  const { title, description } = aboutPage.awardsSection;
  const reduced = useReducedMotionSafe();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (awards.length === 0) return null;

  const visible = awards.slice(0, visibleCount);
  const hasMore = visibleCount < awards.length;
  const isExpanded = visibleCount > PAGE_SIZE;

  const showMore = () => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, awards.length));
  };

  const showLess = () => {
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section id="awards" className="scroll-mt-24 bg-[var(--nh-black)] py-20 md:py-28">
      <div className="px-5 md:px-[7vw]">
        <Reveal className="text-center">
          <NhSectionTitle title={title} tone="dark" />
          <p className="font-detective mx-auto mt-4 max-w-2xl text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.25] text-white/75">
            {description}
          </p>
        </Reveal>

        <ul className="mt-12 md:mt-16">
          {visible.map((award, index) => (
            <AwardRow
              key={`${award.status}-${award.title}-${index}`}
              award={award}
              index={index}
              reduced={reduced}
            />
          ))}
        </ul>

        {awards.length > PAGE_SIZE ? (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {hasMore ? (
              <BrandButton type="button" icon="down" onClick={showMore}>
                Show more
              </BrandButton>
            ) : null}
            {isExpanded ? (
              <BrandButton
                type="button"
                variant="outline-light"
                icon="up"
                onClick={showLess}
              >
                Show less
              </BrandButton>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
