import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { EASE } from "@/components/anim";
import { cn } from "@/lib/utils";

export type PhoneCountry = {
  code: string;
  name: string;
  dial: string;
};

/** Studio default - Dubai / UAE */
export const DEFAULT_PHONE_COUNTRY: PhoneCountry = {
  code: "AE",
  name: "United Arab Emirates",
  dial: "+971",
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  DEFAULT_PHONE_COUNTRY,
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "PH", name: "Philippines", dial: "+63" },
];

function CountryFlag({ code, className }: { code: string; className?: string }) {
  const iso = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      srcSet={`https://flagcdn.com/w80/${iso}.png 2x`}
      alt=""
      width={20}
      height={15}
      loading="lazy"
      decoding="async"
      className={cn(
        "inline-block h-[14px] w-[20px] shrink-0 rounded-[2px] object-cover",
        className,
      )}
    />
  );
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function fullPhone(dial: string, local: string) {
  const localDigits = digitsOnly(local);
  if (!localDigits) return "";
  return `${dial}${localDigits}`;
}

export function FormPhone({
  id,
  name = "phone",
  label = "Phone",
  placeholder = "50 000 0000",
  required = false,
  tone = "light",
  className,
}: {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const fieldId = id ?? name;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [country, setCountry] = React.useState(DEFAULT_PHONE_COUNTRY);
  const [local, setLocal] = React.useState("");
  const dark = tone === "dark";
  const phone = fullPhone(country.dial, local);

  React.useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => {
      setCountry(DEFAULT_PHONE_COUNTRY);
      setLocal("");
      setOpen(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <span
        className={cn(
          "text-xs uppercase tracking-[0.25em]",
          dark ? "text-[11px] text-white/70" : "text-black"
        )}
      >
        {label}
        {!required ? (dark ? "" : " · optional") : ""}
      </span>

      {/* Submitted values */}
      <input type="hidden" name={name} value={phone} />
      <input type="hidden" name={`${name}Country`} value={country.code} />
      <input type="hidden" name={`${name}Dial`} value={country.dial} />

      <div
        className={cn(
          "mt-2 flex items-center border-b transition-colors",
          dark
            ? focused || open
              ? "border-[var(--nh-red)]"
              : "border-white/25"
            : focused || open
              ? "border-ink"
              : "border-black/25"
        )}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Country calling code"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex shrink-0 items-center gap-2 py-3 pr-3 text-sm outline-none",
            dark ? "text-white" : "text-black"
          )}
        >
          <CountryFlag code={country.code} />
          <span className="tabular-nums tracking-wide">{country.dial}</span>
          <span
            aria-hidden
            className={cn(
              "mx-0.5 h-4 w-px",
              dark ? "bg-white/25" : "bg-line"
            )}
          />
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-300",
              dark ? "text-white/70" : "text-black",
              open && "rotate-180",
              open && (dark ? "text-[var(--nh-red)]" : "text-crimson")
            )}
          />
        </button>

        <input
          ref={inputRef}
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          placeholder={placeholder}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent py-3 text-sm outline-none",
            dark
              ? "text-white placeholder:text-white/55"
              : "text-black placeholder:text-black"
          )}
        />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.ul
            role="listbox"
            aria-label="Country calling codes"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.97 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={cn(
              "absolute inset-x-0 top-full z-40 mt-2 max-h-56 origin-top overflow-y-auto rounded-md border p-1.5 shadow-xl",
              dark
                ? "border-white/15 bg-[#0b0b0b] shadow-black/50"
                : "border-line bg-white shadow-black/10"
            )}
          >
            {PHONE_COUNTRIES.map((item) => {
              const selected = item.code === country.code;
              return (
                <li key={item.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setCountry(item);
                      setOpen(false);
                      inputRef.current?.focus();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
                      selected
                        ? dark
                          ? "bg-[var(--nh-red)] text-white"
                          : "bg-crimson text-white"
                        : dark
                          ? "text-white/70 hover:bg-white/[0.06] hover:text-white"
                          : "text-black hover:bg-cream-2"
                    )}
                  >
                    <CountryFlag code={item.code} />
                    <span className="min-w-0 flex-1 truncate">
                      {item.name}{" "}
                      <span className="opacity-70">({item.dial})</span>
                    </span>
                    {selected ? <Check className="size-3.5 shrink-0" /> : null}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
