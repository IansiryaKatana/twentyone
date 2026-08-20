import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";
import { EASE } from "@/components/anim";
import { BrandButton } from "@/components/brand-button";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import flyGraphic from "@/Assets/fly.png";
import whiteBee from "@/Assets/White-bee.png";

const NAV_ORDER = ["Home", "About", "Projects", "Services"] as const;

const primaryLinks = NAV_ORDER.map(
  (label) => nav.links.find((link) => link.label === label)!
);

function linkLabel(label: string) {
  if (label === "About") return "About Us";
  return label;
}

function pathIsActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function NhHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const [open, setOpen] = React.useState(false);
  const [elevated, setElevated] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => {
    const update = () => setElevated(window.scrollY > 24);

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (mq.matches) setOpen(false);
    };
    closeOnDesktop();
    mq.addEventListener("change", closeOnDesktop);
    return () => mq.removeEventListener("change", closeOnDesktop);
  }, []);

  const showBar = elevated || open;
  /** Cream/light pages: dark type while transparent at the top. */
  const onLight = variant === "solid" && !showBar;

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
          showBar
            ? "border-white/10 bg-black"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="relative flex h-16 w-full items-center justify-end gap-5 px-5 sm:h-[4.5rem] md:px-10 lg:justify-between">
          <Link
            to="/"
            aria-label="Twentyone06 home"
            className="absolute left-1/2 shrink-0 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0"
          >
            <BrandLogo surface={onLight ? "light" : "dark"} />
          </Link>

          <nav aria-label="Primary navigation" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {primaryLinks.map((link) => {
                const active = pathIsActive(pathname, link.to);
                return (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-display relative text-[45px] uppercase transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-[var(--nh-red)] after:transition-all",
                        active ? "after:w-full font-bold" : "after:w-0 font-medium hover:after:w-full",
                        active
                          ? "text-[var(--nh-red)]"
                          : onLight
                            ? "text-ink/70 hover:text-ink"
                            : "text-white/75 hover:text-white"
                      )}
                    >
                      {linkLabel(link.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            <BrandButton to="/contact" className="hidden sm:inline-flex">
              Let&apos;s Talk
            </BrandButton>
            <img
              src={whiteBee}
              alt=""
              aria-hidden
              className={cn(
                "hidden h-10 w-auto object-contain lg:block",
                onLight && "invert",
              )}
            />
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "btn-cut flex size-10 items-center justify-center border-2 bg-white text-ink transition-colors hover:border-[var(--nh-red)] hover:bg-[var(--nh-red)] hover:text-white lg:hidden",
                onLight ? "border-ink" : "border-white"
              )}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: EASE }}
            className="fixed inset-0 z-40 flex bg-black px-5 pb-12 pt-16 md:px-10 md:pt-20"
          >
            <nav className="relative z-10 flex w-full flex-col justify-between overflow-y-auto" aria-label="Menu">
              <ul>
                {primaryLinks.map((link, index) => {
                  const active = pathIsActive(pathname, link.to);
                  return (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: EASE,
                        delay: 0.2 + index * 0.06,
                      }}
                      className="border-b border-white/12"
                    >
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "font-display block py-3 text-[clamp(2.25rem,7vw,5.5rem)] leading-none transition-colors",
                          active
                            ? "text-[var(--nh-red)]"
                            : "text-white hover:text-[var(--nh-red)]"
                        )}
                      >
                        {linkLabel(link.label)}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-3 pt-8 text-[10px] uppercase tracking-[0.24em] text-white/45 sm:flex-row sm:justify-between">
                <span>Dubai, United Arab Emirates</span>
                <a href="mailto:info@twentyone06.com" className="hover:text-white">
                  info@twentyone06.com
                </a>
              </div>
            </nav>

            <img
              src={flyGraphic}
              alt=""
              aria-hidden
              className="pointer-events-none absolute right-[-6%] bottom-[18%] z-0 w-[min(46vw,240px)] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
