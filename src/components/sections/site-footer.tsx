import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { footer } from "@/data/content";
import { LinesReveal, Reveal } from "@/components/anim";

function Wordmark() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ x: -1000, y: -1000 });
  const [active, setActive] = React.useState(false);
  const [img, setImg] = React.useState(0);

  // Cycle the revealed image while the cursor is hovering.
  React.useEffect(() => {
    if (!active) return;
    const t = setInterval(
      () => setImg((i) => (i + 1) % footer.wordmarkImages.length),
      1400
    );
    return () => clearInterval(t);
  }, [active]);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const mask = `radial-gradient(circle 170px at ${pos.x}px ${pos.y}px, #000 0%, #000 35%, transparent 72%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setPos({ x: -1000, y: -1000 });
      }}
      className="relative mt-16 select-none md:mt-24"
    >
      {/* Base outline text */}
      <h2 className="font-display pointer-events-none text-center text-[clamp(4rem,23vw,20rem)] font-normal leading-[0.8] tracking-tight text-cream/[0.14] md:text-left">
        {footer.wordmark}
      </h2>

      {/* Image-filled text revealed under the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: active ? 1 : 0 }}
      >
        <h2
          className="font-display bg-cover bg-center text-center text-[clamp(4rem,23vw,20rem)] font-normal leading-[0.8] tracking-tight text-transparent md:text-left"
          style={{
            backgroundImage: `url(${footer.wordmarkImages[img]})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitMaskImage: mask,
            maskImage: mask,
          }}
        >
          {footer.wordmark}
        </h2>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-espresso text-cream"
    >
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-20 md:px-10 md:pt-28">
        {/* CTA row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <LinesReveal
            as="h2"
            lines={footer.cta.title}
            className="font-display max-w-2xl text-[clamp(1.8rem,3.6vw,3.2rem)] font-normal leading-[1.05] text-cream"
          />
          <Reveal delay={0.15} className="flex flex-col items-start md:items-end">
            <div className="inline-flex w-full flex-col items-stretch gap-4 sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {footer.cta.avatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="size-9 rounded-full border-2 border-espresso object-cover"
                    />
                  ))}
                </div>
                <span className="text-xs text-cream/70">{footer.cta.members}</span>
              </div>
              <Link
                to={footer.cta.buttonTo}
                className="group inline-flex w-full items-center justify-between gap-2 rounded-full bg-cream py-2 pl-6 pr-2 text-sm text-ink transition-colors hover:bg-white"
              >
                {footer.cta.button}
                <span className="flex size-8 items-center justify-center rounded-full bg-ink text-cream transition-all duration-300 group-hover:rotate-45 group-hover:bg-crimson">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="my-12 h-px w-full bg-cream/15" />

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-cream/50">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"to" in link && link.to ? (
                      <Link
                        to={link.to as "/"}
                        {...("params" in link && link.params
                          ? { params: link.params as Record<string, string> }
                          : {})}
                        {...("hash" in link && link.hash ? { hash: link.hash } : {})}
                        className="group inline-flex items-center gap-1.5 text-sm text-cream/85 transition-colors hover:text-cream"
                      >
                        {link.label}
                        {col.arrow && (
                          <ArrowUpRight className="size-3.5 text-cream/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream" />
                        )}
                      </Link>
                    ) : (
                      <a
                        href={"href" in link ? link.href : "#"}
                        {...(typeof link.href === "string" &&
                        link.href.startsWith("http")
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }
                          : {})}
                        className="group inline-flex items-center gap-1.5 text-sm text-cream/85 transition-colors hover:text-cream"
                      >
                        {link.label}
                        {col.arrow && (
                          <ArrowUpRight className="size-3.5 text-cream/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream" />
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-cream/50">
              {footer.location.title}
            </h3>
            <address className="not-italic text-sm leading-relaxed text-cream/85">
              {footer.location.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </address>
            <h3 className="mb-2 mt-5 text-xs uppercase tracking-[0.25em] text-cream/50">
              {footer.location.callTitle}
            </h3>
            <a
              href={footer.location.phoneHref}
              className="text-sm text-cream/85 transition-colors hover:text-cream"
            >
              {footer.location.phone}
            </a>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-14 flex flex-col gap-3 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <span>{footer.copyright}</span>
          <div className="flex items-center gap-5">
            {footer.legal.map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-cream">
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* Giant interactive wordmark */}
        <Wordmark />
      </div>
    </footer>
  );
}
