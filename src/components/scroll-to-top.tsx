import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EASE, useReducedMotionSafe } from "@/components/anim";
import { HexIconButton } from "@/components/hex-icon-button";

/** Studio landline as WhatsApp deep link (UAE). */
const WHATSAPP_URL = "https://wa.me/97145548082";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function useScrollChrome() {
  const [atTop, setAtTop] = React.useState(true);
  const [atBottom, setAtBottom] = React.useState(false);
  const [direction, setDirection] = React.useState<"up" | "down">("down");
  const lastY = React.useRef(0);

  React.useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      setAtTop(y < 24);
      setAtBottom(y >= max - 24);

      const delta = y - lastY.current;
      if (Math.abs(delta) >= 6) {
        setDirection(delta > 0 ? "down" : "up");
        lastY.current = y;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { atTop, atBottom, direction };
}

export function ScrollToTop() {
  const [footerVisible, setFooterVisible] = React.useState(false);
  const { atTop, atBottom, direction } = useScrollChrome();
  const reduced = useReducedMotionSafe();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  React.useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) {
      setFooterVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { root: null, threshold: 0.05 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  const scrollByPage = (direction: 1 | -1) => {
    const behavior = reduced ? "auto" : "smooth";
    window.scrollBy({
      top: direction * window.innerHeight * 0.9,
      behavior,
    });
  };

  if (isAdmin) return null;

  const showUp = !atTop && (atBottom || direction === "up");
  const showDown = !atBottom && (atTop || direction === "down");

  return (
    <div className="fixed right-5 bottom-6 z-50 flex flex-col items-center gap-3 md:right-8 md:bottom-8">
      <AnimatePresence mode="wait">
        {showUp ? (
          <motion.div
            key="scroll-up"
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <HexIconButton label="Scroll up" onClick={() => scrollByPage(-1)}>
              <ChevronUp className="size-5" strokeWidth={2.5} />
            </HexIconButton>
          </motion.div>
        ) : showDown ? (
          <motion.div
            key="scroll-down"
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <HexIconButton label="Scroll down" onClick={() => scrollByPage(1)}>
              <ChevronDown className="size-5" strokeWidth={2.5} />
            </HexIconButton>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {footerVisible ? (
          <motion.a
            key="whatsapp-fab"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="whatsapp-pulse relative flex size-11 items-center justify-center rounded-full bg-[#25D366] text-white md:size-12"
          >
            <span className="whatsapp-pulse-ring" aria-hidden />
            <WhatsAppIcon className="relative z-10 size-5 md:size-6" />
          </motion.a>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
