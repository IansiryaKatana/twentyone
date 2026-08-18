import { projectsPage } from "@/data/content";
import { Reveal } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";

export function PrPhilosophy() {
  const { philosophy } = projectsPage;

  return (
    <section className="relative z-10 flex min-h-[100svh] flex-col justify-center bg-[var(--nh-black)] px-5 py-20 md:px-10 md:py-28 lg:px-[7vw]">
      <Reveal className="flex justify-center">
        <NhSectionTitle
          title={philosophy.title.join(" ")}
          tone="dark"
        />
      </Reveal>

      <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
        <Reveal>
          <p className="font-display text-center text-[clamp(2.45rem,4.48vw,3.85rem)] font-medium leading-[1.05] text-[var(--nh-white)] md:text-left">
            {philosophy.quote}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="font-detective text-center text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-white/65 md:text-left">
            {philosophy.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
