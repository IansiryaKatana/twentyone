import { stats } from "@/data/content";
import { CountUp, Stagger, StaggerItem } from "@/components/anim";

export function Stats() {
  return (
    <section className="bg-cream pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Stagger
          stagger={0.12}
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {stats.map((stat) => (
            <StaggerItem
              key={stat.sub}
              className="rounded-lg border border-line/60 bg-cream-2/60 p-6 md:p-8"
            >
              <div className="flex items-baseline gap-1 font-display text-ink">
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-normal leading-none tracking-tight"
                />
                <span className="ml-1 text-xs font-sans tracking-wide text-muted-ink">
                  {stat.label}
                </span>
              </div>
              <p className="mt-6 text-xs tracking-wide text-muted-ink">
                {stat.sub}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
