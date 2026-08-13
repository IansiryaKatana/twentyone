import type { ReactNode } from "react";
import { LinesReveal, Reveal } from "@/components/anim";
import { BrandButton } from "@/components/brand-button";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageTablet,
  imageMobile,
  className,
  titleClassName,
}: {
  eyebrow: string;
  title: string[];
  description?: string;
  /** Optional full-bleed background — desktop (and fallback). */
  image?: string;
  /** Optional tablet background; falls back to `image` when omitted. */
  imageTablet?: string;
  /** Optional mobile background; falls back to tablet/`image` when omitted. */
  imageMobile?: string;
  className?: string;
  /** Optional override for the display title (e.g. `font-detective`). */
  titleClassName?: string;
}) {
  const hasImage = Boolean(image || imageTablet || imageMobile);

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
          <ResponsiveBgImage
            bg={{
              desktop: image || imageTablet || imageMobile || "",
              tablet: imageTablet || image || imageMobile || "",
              mobile: imageMobile || imageTablet || image || "",
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70"
            aria-hidden
          />
        </>
      ) : null}

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-5 text-center md:px-10">
        <p
          className={cn(
            "mb-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.35em]",
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
          <span
            className={cn(
              "h-px w-10",
              hasImage ? "bg-white/35" : "bg-ink/25"
            )}
          />
        </p>
        <LinesReveal
          as="h1"
          lines={title}
          className={cn(
            "max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.92]",
            titleClassName ?? "font-display",
            hasImage ? "text-white" : "text-ink",
          )}
        />
        {description && (
          <Reveal delay={0.2} className="mt-6 max-w-xl">
            <p
              className={cn(
                "font-detective text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.35]",
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
  variant = "black",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "red" | "black";
}) {
  return (
    <BrandButton to={to} href={href} variant={variant} className={className}>
      {children}
    </BrandButton>
  );
}
