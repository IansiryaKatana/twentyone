import * as React from "react";
import { cn } from "@/lib/utils";

type NhSectionTitleProps = {
  title: string | readonly string[];
  /** `light` = black display on cream/gray; `dark` = white display on black */
  tone?: "light" | "dark";
  /** Detective overlay color — default brand red */
  accent?: "red" | "white" | "black";
  /** Show Detective lockup under the Zeuxis title */
  lockup?: boolean;
  align?: "center" | "left";
  className?: string;
};

function FittedTitleLine({
  children,
  align,
  className,
}: {
  children: string;
  align: "center" | "left";
  className?: string;
}) {
  const boxRef = React.useRef<HTMLSpanElement | null>(null);
  const textRef = React.useRef<HTMLSpanElement | null>(null);
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(min-width: 768px)").matches) {
          setScale(1);
          return;
        }
        const target = box.clientWidth;
        const natural = text.scrollWidth;
        if (target <= 0 || natural <= 0) return;
        const next = Math.min(1, target / natural);
        setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
      });
    };

    fit();
    void document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit);
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    window.addEventListener("resize", fit);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", fit);
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, [children]);

  const centered = align === "center";

  return (
    <span
      ref={boxRef}
      className={cn(
        "block w-full max-w-full overflow-hidden",
        centered && "text-center",
      )}
      style={scale === 1 ? undefined : { height: `${scale * 0.92}em` }}
    >
      <span
        ref={textRef}
        className={cn(
          "inline-block max-w-none whitespace-nowrap will-change-transform",
          centered ? "origin-top" : "origin-top-left",
          className,
        )}
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Layered section head: large Zeuxis + smaller Detective in brand red
 * overlapping the lower third (matches brand dual-type lockup).
 */
export function NhSectionTitle({
  title,
  tone = "light",
  accent = "red",
  lockup = true,
  align = "center",
  className,
}: NhSectionTitleProps) {
  const lines = (Array.isArray(title) ? title : [title]).filter(Boolean);
  const lockupText = lines[lines.length - 1] ?? "";

  return (
    <h2
      className={cn(
        "relative flex w-full max-w-full flex-col overflow-hidden",
        align === "center"
          ? "mx-auto items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      <span
        className={cn(
          "font-display w-full max-w-full text-[clamp(5rem,12vw,8.8rem)] font-medium uppercase leading-[0.92] lg:text-[clamp(5.2rem,12.48vw,11.44rem)]",
          tone === "dark" ? "text-[var(--nh-white)]" : "text-[var(--nh-black)]",
        )}
      >
        {lines.map((line) => (
          <FittedTitleLine key={line} align={align}>
            {line}
          </FittedTitleLine>
        ))}
      </span>
      {lockup ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-[0.02em] w-full max-w-full overflow-hidden font-detective text-[clamp(1.9rem,4vw,2.4rem)] font-normal uppercase leading-none tracking-[0.04em] lg:text-[clamp(1.976rem,4.16vw,3.12rem)]",
            align === "center" ? "left-0" : "left-0",
            accent === "white" && "text-white",
            accent === "black" && "text-[var(--nh-black)]",
            accent === "red" && "text-[var(--nh-red)]",
          )}
        >
          <FittedTitleLine align={align}>{lockupText}</FittedTitleLine>
        </span>
      ) : null}
    </h2>
  );
}
