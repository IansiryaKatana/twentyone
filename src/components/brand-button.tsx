import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant =
  | "red"
  | "black"
  | "white"
  | "cream"
  | "outline-light"
  | "outline-dark";

type IconName = "chevron" | "down" | "up" | "none";

type BrandButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  icon?: IconName;
  to?: string;
  href?: string;
  search?: object;
  hash?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ICONS = {
  chevron: ChevronRight,
  down: ChevronDown,
  up: ChevronUp,
} as const;

const FILL: Record<
  Exclude<Variant, "outline-light" | "outline-dark">,
  string
> = {
  red: "bg-[var(--nh-red)] text-white hover:bg-white hover:text-black",
  black: "bg-black text-cream hover:bg-[var(--nh-red)] hover:text-white",
  white: "bg-white text-black hover:bg-white/90",
  cream: "bg-cream text-ink hover:bg-white",
};

const OUTLINE_SHELL = {
  "outline-light": "bg-white/40 hover:bg-white",
  "outline-dark": "bg-ink/30 hover:bg-ink",
} as const;

const OUTLINE_INNER = {
  "outline-light":
    "bg-[var(--nh-black)] text-white group-hover:bg-white group-hover:text-black",
  "outline-dark":
    "bg-cream text-ink group-hover:bg-ink group-hover:text-cream",
} as const;

const LABEL =
  "inline-flex items-center justify-center gap-2 px-[1.4rem] py-2.5 text-[16px] font-medium uppercase tracking-[0.22em] transition-colors duration-300";

export function BrandButton({
  children,
  className,
  variant = "red",
  icon = "chevron",
  to,
  href,
  search,
  hash,
  type = "button",
  disabled,
  onClick,
}: BrandButtonProps) {
  const Icon = icon === "none" ? null : ICONS[icon];
  const content = (
    <>
      {children}
      {Icon ? (
        <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      ) : null}
    </>
  );

  const isOutline = variant === "outline-light" || variant === "outline-dark";

  const inner = isOutline ? (
    <span className={cn("btn-cut w-full", LABEL, OUTLINE_INNER[variant])}>
      {content}
    </span>
  ) : (
    content
  );

  const classes = cn(
    "btn-cut group inline-flex items-center justify-center disabled:opacity-60",
    isOutline
      ? cn("p-px", OUTLINE_SHELL[variant])
      : cn(
          LABEL,
          FILL[variant as Exclude<Variant, "outline-light" | "outline-dark">],
        ),
    className,
  );

  if (to) {
    return (
      <Link
        to={to as "/"}
        {...(search ? { search: search as never } : {})}
        {...(hash ? { hash } : {})}
        className={classes}
      >
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {inner}
    </button>
  );
}
