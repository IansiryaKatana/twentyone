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
          "font-display text-[clamp(3.125rem,7.5vw,5.5rem)] font-medium uppercase leading-[0.92] lg:text-[clamp(3.25rem,7.8vw,7.15rem)]",
          tone === "dark" ? "text-[var(--nh-white)]" : "text-[var(--nh-black)]",
        )}
      >
        {title}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-[0.02em] left-1/2 -translate-x-1/2 font-detective text-[clamp(1.1875rem,2.5vw,1.5rem)] font-normal uppercase leading-none tracking-[0.04em] whitespace-nowrap lg:text-[clamp(1.235rem,2.6vw,1.95rem)]",
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
