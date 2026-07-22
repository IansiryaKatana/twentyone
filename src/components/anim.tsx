import * as React from "react";
import {
  motion,
  useInView,
  animate,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

/* Shared easing — a soft, editorial cubic-bezier used across the site. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Reveal — fade + rise as the element scrolls into view                     */
/* -------------------------------------------------------------------------- */
type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  amount = 0.35,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stagger — parent/child orchestration                                      */
/* -------------------------------------------------------------------------- */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
  amount = 0.25,
  once = true,
  ...props
}: HTMLMotionProps<"div"> & {
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
}) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div className={className} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  LinesReveal — headline lines wiping up from behind a mask                 */
/* -------------------------------------------------------------------------- */
export function LinesReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  as = "h2",
  once = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
  once?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, amount: 0.4 });
  const Tag = motion[as];

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="block overflow-hidden pb-[0.12em]"
        >
          <motion.span
            className={cn("block", lineClassName)}
            initial={{ y: "115%" }}
            animate={inView ? { y: "0%" } : { y: "115%" }}
            transition={{
              duration: 0.95,
              ease: EASE,
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  CountUp — animate a number when it enters the viewport                    */
/* -------------------------------------------------------------------------- */
export function CountUp({
  to,
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Parallax image — subtle depth on scroll (used in cards / hero)            */
/* -------------------------------------------------------------------------- */
export function useReducedMotionSafe() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
