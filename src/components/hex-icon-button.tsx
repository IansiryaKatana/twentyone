import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZE = {
  sm: "size-8 [--btn-cut:8px]",
  md: "size-11 [--btn-cut:11px] md:size-12 md:[--btn-cut:12px]",
} as const;

const TONE = {
  red: "bg-[var(--nh-red)] hover:bg-white hover:text-black",
  linkedin: "bg-[#0A66C2] hover:opacity-90",
  instagram:
    "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90",
} as const;

export function HexIconButton({
  label,
  className,
  size = "md",
  tone = "red",
  disabled,
  children,
  href,
  onClick,
}: {
  label: string;
  className?: string;
  size?: keyof typeof SIZE;
  tone?: keyof typeof TONE;
  disabled?: boolean;
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const classes = cn(
    "btn-cut inline-flex items-center justify-center text-white transition-colors duration-300 disabled:pointer-events-none disabled:opacity-35",
    SIZE[size],
    TONE[tone],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
