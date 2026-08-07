import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { LinesReveal, Reveal } from "@/components/anim";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageMobile,
  className,
  titleClassName,
}: {
  eyebrow: string;
  title: string[];
  description?: string;
  /** Optional full-bleed background — desktop (and fallback). */
  image?: string;
  /** Optional mobile background; falls back to `image` when omitted. */
  imageMobile?: string;
  className?: string;
  /** Optional override for the display title (e.g. `font-detective`). */
  titleClassName?: string;
}) {
  const hasImage = Boolean(image || imageMobile);

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16",
        hasImage ? "bg-[var(--nh-black,#0a0a0a)]" : "bg-cream",
        className
      )}
    >
      {hasImage ? (
        <>
          <picture>
            {imageMobile ? (
              <source media="(max-width: 767px)" srcSet={imageMobile} />
            ) : null}
            {image ? (
              <source media="(min-width: 768px)" srcSet={image} />
            ) : null}
            <img
              src={image || imageMobile}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          </picture>
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70"
            aria-hidden
          />
        </>
      ) : null}

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <p
          className={cn(
            "mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.35em]",
            hasImage ? "text-white/65" : "text-muted-ink"
          )}
        >
          <span
            className={cn(
              "h-px w-10",
              hasImage ? "bg-white/35" : "bg-ink/25"
            )}
          />
          {eyebrow}
        </p>
        <LinesReveal
          as="h1"
          lines={title}
          className={cn(
            "max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter",
            titleClassName ?? "font-display",
            hasImage ? "text-white" : "text-ink",
          )}
        />
        {description && (
          <Reveal delay={0.2} className="mt-6 max-w-xl">
            <p
              className={cn(
                "text-sm leading-relaxed md:text-base",
                hasImage ? "text-white/75" : "text-muted-ink"
              )}
            >
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
    "group inline-flex items-center gap-2 rounded-md bg-black py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-crimson",
    className
  );
  const icon = (
    <span className="flex size-8 items-center justify-center rounded-md bg-cream text-ink transition-transform duration-300 group-hover:rotate-45">
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
