import { cn } from "@/lib/utils";

type NhSectionTitleProps = {
  title: string;
  /** `light` = black display on cream/gray; `dark` = white display on black */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Layered section head: large Zeuxis + smaller Detective in brand red
 * overlapping the lower third (matches brand dual-type lockup).
 */
export function NhSectionTitle({
  title,
  tone = "light",
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
          "font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium uppercase leading-[0.92]",
          tone === "dark" ? "text-[var(--nh-white)]" : "text-[var(--nh-black)]",
        )}
      >
        {title}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[0.02em] left-1/2 -translate-x-1/2 font-detective text-[clamp(0.95rem,2vw,1.5rem)] font-normal uppercase leading-none tracking-[0.04em] text-[var(--nh-red)] whitespace-nowrap"
      >
        {title}
      </span>
    </h2>
  );
}
