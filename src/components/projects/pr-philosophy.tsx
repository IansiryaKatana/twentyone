import { projectsPage } from "@/data/content";
import { Reveal } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";

export function PrPhilosophy() {
  const { philosophy } = projectsPage;

  return (
    <section className="relative z-10 flex flex-col bg-[var(--nh-black)] px-5 py-16 md:min-h-[100svh] md:justify-center md:px-10 md:py-28 lg:px-[7vw]">
      <Reveal className="flex justify-center">
        <NhSectionTitle
          title={philosophy.title.join(" ")}
          tone="dark"
        />
      </Reveal>

      <div className="mx-auto mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
        <Reveal>
          <p className="font-display text-center text-[clamp(3.3075rem,6.048vw,5.1975rem)] font-medium leading-[0.92] text-[var(--nh-white)] md:text-left">
            {philosophy.quote}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="font-detective text-center text-[clamp(0.945rem,1.4vw,1.225rem)] font-medium leading-[1.15] text-white/70 md:text-left">
            {philosophy.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
