import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { LinesReveal, Reveal } from "@/components/anim";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string[];
  description?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-cream pt-28 pb-12 md:pt-36 md:pb-16",
        className
      )}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-ink">
          <span className="h-px w-10 bg-ink/25" />
          {eyebrow}
        </p>
        <LinesReveal
          as="h1"
          lines={title}
          className="font-display max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[0.95] text-ink"
        />
        {description && (
          <Reveal delay={0.2} className="mt-6 max-w-xl">
            <p className="text-sm leading-relaxed text-muted-ink md:text-base">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function PillCta({
  to,
  href,
  children,
  className,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center gap-2 rounded-full bg-espresso py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-crimson",
    className
  );
  const icon = (
    <span className="flex size-8 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:rotate-45">
      <ArrowUpRight className="size-4" />
    </span>
  );

  if (to) {
    return (
      <Link to={to as "/"} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <a href={href ?? "#"} className={classes}>
      {children}
      {icon}
    </a>
  );
}
