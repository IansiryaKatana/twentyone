import { cn } from "@/lib/utils";
import type { SectionBackgroundSet } from "@/lib/cms/sectionBackgrounds";

type ResponsiveBgImageProps = {
  bg: SectionBackgroundSet;
  alt?: string;
  className?: string;
  imgClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
};

/**
 * Serves mobile ≤767, tablet 768-1023, desktop ≥1024.
 * Falls back through tablet → desktop when a slot is empty (already resolved).
 */
export function ResponsiveBgImage({
  bg,
  alt = "",
  className,
  imgClassName,
  fetchPriority,
}: ResponsiveBgImageProps) {
  const desktop = bg.desktop;
  const tablet = bg.tablet || desktop;
  const mobile = bg.mobile || tablet || desktop;

  if (!desktop && !mobile) return null;

  return (
    <picture className={className}>
      {mobile ? (
        <source media="(max-width: 767px)" srcSet={mobile} />
      ) : null}
      {tablet ? (
        <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={tablet} />
      ) : null}
      {desktop ? (
        <source media="(min-width: 1024px)" srcSet={desktop} />
      ) : null}
      <img
        src={desktop || mobile}
        alt={alt}
        className={cn("absolute inset-0 size-full object-cover", imgClassName)}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
