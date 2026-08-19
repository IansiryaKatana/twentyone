import { newHome } from "@/data/content";
import { Reveal } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import { PrProjectGrid } from "@/components/projects/pr-portfolio";

export function NhProjects() {
  const { projects: section } = newHome;

  return (
    <section className="bg-[var(--nh-black)] px-5 py-20 md:px-10 md:py-28 lg:px-[7vw]">
      <Reveal className="flex justify-center">
        <NhSectionTitle title={section.title} tone="dark" />
      </Reveal>
      <PrProjectGrid />
    </section>
  );
}
