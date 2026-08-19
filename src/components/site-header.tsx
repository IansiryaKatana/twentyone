import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/anim";
import { BrandButton } from "@/components/brand-button";
import { BrandLogo } from "@/components/brand-logo";

type HeaderVariant = "overlay" | "solid";

export function SiteHeader({ variant = "overlay" }: { variant?: HeaderVariant }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = variant === "solid" || scrolled;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        dark
          ? "bg-cream/85 backdrop-blur-md border-b border-line/70"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:h-20 sm:gap-4 sm:px-5 md:px-10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "group flex shrink-0 items-center gap-2 text-sm tracking-wide transition-colors sm:gap-3",
            dark ? "text-ink" : "text-cream"
          )}
        >
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-full border transition-colors",
              dark
                ? "border-ink/25 group-hover:bg-ink group-hover:text-cream"
                : "border-cream/40 group-hover:bg-cream group-hover:text-ink"
            )}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </span>
          <span className="hidden sm:inline">Menu</span>
        </button>

        <Link
          to="/"
          aria-label="Twentyone06 home"
          className="min-w-0 justify-self-center"
        >
          <BrandLogo
            surface={dark ? "light" : "dark"}
            className="mx-auto"
          />
        </Link>

        <BrandButton
          to="/contact"
          variant={dark ? "black" : "cream"}
          className="shrink-0"
        >
          <span className="hidden sm:inline">Contact Us</span>
          <span className="sm:hidden">Contact</span>
        </BrandButton>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden bg-cream/95 backdrop-blur-md"
          >
            <ul className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-6 md:px-10">
              {nav.links.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, ease: EASE }}
                >
                  <Link
                    to={link.to}
                    {...("hash" in link && link.hash ? { hash: link.hash } : {})}
                    onClick={() => setOpen(false)}
                    className="font-display block py-2 text-3xl tracking-wide text-ink/80 transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
