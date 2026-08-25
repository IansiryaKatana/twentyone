import { nav } from "@/data/content";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** Background behind the wordmark - picks matching type color. */
  surface: "light" | "dark";
  className?: string;
};

export function BrandLogo({ surface, className }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "font-display inline-block whitespace-nowrap text-[clamp(1.75rem,8vw,45px)] font-medium uppercase leading-none sm:text-[45px]",
        surface === "light" ? "text-ink" : "text-white",
        className
      )}
    >
      {nav.brand}
    </span>
  );
}
