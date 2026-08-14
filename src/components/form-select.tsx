import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { EASE } from "@/components/anim";
import { cn } from "@/lib/utils";

export function FormSelect({
  id,
  name,
  label,
  placeholder,
  options,
  required,
  tone = "light",
  className,
}: {
  id: string;
  name: string;
  label?: string;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const dark = tone === "dark";

  React.useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {label ? (
        <span
          className={cn(
            "text-xs uppercase tracking-[0.25em]",
            dark ? "text-[11px] text-white/70" : "text-black"
          )}
        >
          {label}
        </span>
      ) : null}

      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-label={label ?? placeholder}
        className={cn(
          "group flex w-full items-center justify-between border-b py-3 text-left text-sm outline-none transition-colors",
          dark
            ? "border-white/25 text-white hover:border-white/50 focus-visible:border-[var(--nh-red)]"
            : "border-black/25 text-black hover:border-black/50 focus-visible:border-black",
          label && "mt-2"
        )}
      >
        <span
          className={cn(
            value
              ? dark
                ? "text-white"
                : "text-black"
              : dark
                ? "text-white/55"
                : "text-black"
          )}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-300",
            dark ? "text-white/70" : "text-black",
            open && (dark ? "rotate-180 text-[var(--nh-red)]" : "rotate-180 text-crimson")
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-options`}
            role="listbox"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.97 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={cn(
              "absolute inset-x-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-md border p-1.5 shadow-xl",
              dark
                ? "border-white/15 bg-[#0b0b0b] shadow-black/50"
                : "border-line bg-white shadow-black/10"
            )}
          >
            {options.map((option) => {
              const selected = option === value;
              return (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setValue(option);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-sm px-4 py-3 text-left text-sm transition-colors",
                      selected
                        ? dark
                          ? "bg-[var(--nh-red)] text-white"
                          : "bg-crimson text-white"
                        : dark
                          ? "text-white/70 hover:bg-white/8 hover:text-white"
                          : "text-black hover:bg-cream-2"
                    )}
                  >
                    {option}
                    {selected ? <Check className="size-4 shrink-0" /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
