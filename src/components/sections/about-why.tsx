import { aboutPage, type WhyUsItem } from "@/data/content";
import { useCmsContent } from "@/hooks/useCmsContent";
import { Reveal, Stagger, StaggerItem } from "@/components/anim";

function WhyCard({ item, index }: { item: WhyUsItem; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <article className="border-t border-line/70 pt-6 md:pt-8">
      <p className="font-display text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-none tracking-tighter text-muted-ink">
        {n}
      </p>
      <h3 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,1.85rem)] font-medium leading-[0.95] tracking-tighter text-ink">
        {item.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-muted-ink">{item.body}</p>
    </article>
  );
}

export function AboutWhySection() {
  const { whyUs } = useCmsContent();
  const { title } = aboutPage.whySection;

  if (whyUs.length === 0) return null;

  return (
    <section className="bg-cream-2 py-20 md:py-28">
      <div className="px-5 md:px-[7vw]">
        <Reveal>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-tighter text-ink">
            {title}
          </h2>
        </Reveal>

        <Stagger
          stagger={0.08}
          className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3"
        >
          {whyUs.map((item, index) => (
            <StaggerItem key={`${item.title}-${index}`}>
              <WhyCard item={item} index={index} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
