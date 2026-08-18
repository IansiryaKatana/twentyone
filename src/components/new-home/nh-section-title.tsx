import { cn } from "@/lib/utils";

type NhSectionTitleProps = {
  title: string;
  /** `light` = black display on cream/gray; `dark` = white display on black */
  tone?: "light" | "dark";
  /** Detective overlay color — default brand red */
  accent?: "red" | "white" | "black";
  className?: string;
};

/**
 * Layered section head: large Zeuxis + smaller Detective in brand red
 * overlapping the lower third (matches brand dual-type lockup).
 */
export function NhSectionTitle({
  title,
  tone = "light",
  accent = "red",
  className,
}: NhSectionTitleProps) {
  return (
    <h2
      className={cn(
        "relative mx-auto inline-flex max-w-full flex-col items-center text-center",
        className,
      )}
    >
      <span
        className={cn(
          "font-display text-[clamp(5rem,12vw,8.8rem)] font-medium uppercase leading-[0.92] lg:text-[clamp(5.2rem,12.48vw,11.44rem)]",
          tone === "dark" ? "text-[var(--nh-white)]" : "text-[var(--nh-black)]",
        )}
      >
        {title}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-[0.02em] left-1/2 -translate-x-1/2 font-detective text-[clamp(1.9rem,4vw,2.4rem)] font-normal uppercase leading-none tracking-[0.04em] whitespace-nowrap lg:text-[clamp(1.976rem,4.16vw,3.12rem)]",
          accent === "white" && "text-white",
          accent === "black" && "text-[var(--nh-black)]",
          accent === "red" && "text-[var(--nh-red)]",
        )}
      >
        {title}
      </span>
    </h2>
  );
}
