import { aboutPage, type WhyUsItem } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { Reveal } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";
import whyUs01 from "@/Assets/why-us/why-us-01.png";
import whyUs02 from "@/Assets/why-us/why-us-02.png";
import whyUs03 from "@/Assets/why-us/why-us-03.png";
import whyUs04 from "@/Assets/why-us/why-us-04.png";
import whyUs05 from "@/Assets/why-us/why-us-05.png";
import whyUs06 from "@/Assets/why-us/why-us-06.png";

const WHY_US_ICONS = [whyUs04, whyUs03, whyUs01, whyUs02, whyUs05, whyUs06];

function WhyCard({ item, index }: { item: WhyUsItem; index: number }) {
  const icon = WHY_US_ICONS[index];

  return (
    <Reveal y={36} amount={0.35} delay={(index % 3) * 0.06}>
      <article className="border-t border-line/70 pt-6 md:pt-8">
        {icon ? (
          <img
            src={icon}
            alt=""
            aria-hidden
            className="h-[3.125rem] w-auto object-contain mix-blend-multiply md:h-[3.75rem]"
          />
        ) : null}
      <h3 className="font-display mt-3 text-[clamp(2.1875rem,4vw,2.3125rem)] font-medium leading-[0.92] text-ink md:text-[clamp(2.7375rem,5vw,2.8875rem)]">
        {item.title}
      </h3>
        <p className="font-detective mt-4 text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.35] text-ink">
          {item.body}
        </p>
      </article>
    </Reveal>
  );
}

export function AboutWhySection() {
  const { whyUs } = useCmsContent();
  const { title } = aboutPage.whySection;

  if (whyUs.length === 0) return null;

  return (
    <section className="bg-cream-2 py-20 md:py-28">
      <div className="px-5 md:px-[7vw]">
        <Reveal className="flex justify-center">
          <NhSectionTitle title={title} />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {whyUs.map((item, index) => (
            <WhyCard key={`${item.title}-${index}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
