import logo01 from "@/Assets/Partners-and-clients01.png";
import logo02 from "@/Assets/Partners-and-clients02-1024x207.png";
import logo03 from "@/Assets/Partners-and-clients03-1024x528.png";
import logo04 from "@/Assets/Partners-and-clients04.png";
import logo05 from "@/Assets/Partners-and-clients05-1024x358.png";
import logo06 from "@/Assets/Partners-and-clients06-1024x512.png";
import logo07 from "@/Assets/Partners-and-clients07-1024x434.png";
import logo09 from "@/Assets/Partners-and-clients09-1024x348.png";
import logo11 from "@/Assets/Partners-and-clients11-1024x386.png";
import { partnersSection } from "@/data/content";
import { Reveal } from "@/components/anim";

const logos = [
  logo01,
  logo02,
  logo03,
  logo04,
  logo05,
  logo06,
  logo07,
  logo09,
  logo11,
];

function Logo({ src }: { src: string }) {
  return (
    <span className="relative flex h-9 items-center md:h-12">
      <img
        src={src}
        alt="Partner logo"
        className="h-full w-auto opacity-0"
        loading="lazy"
        draggable={false}
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-white opacity-90 transition-opacity duration-300 hover:opacity-100"
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </span>
  );
}

export function Partners() {
  const row = [...logos, ...logos];

  return (
    <section
      aria-label={partnersSection.title}
      className="relative w-full overflow-hidden bg-[var(--nh-red)] py-16 md:py-20"
    >
      <div className="px-5 md:px-[7vw]">
        <Reveal>
          <h2 className="font-display text-center text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] text-white">
            {partnersSection.title}
          </h2>
        </Reveal>

        <div className="marquee-strip relative mt-10 overflow-hidden md:hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--nh-red)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--nh-red)] to-transparent" />
          <div className="marquee-track">
            {row.map((src, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center justify-center px-8"
                aria-hidden={i >= logos.length}
              >
                <Logo src={src} />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 hidden grid-cols-3 gap-x-12 gap-y-10 md:grid lg:gap-x-16 lg:gap-y-14">
          {logos.map((src) => (
            <div key={src} className="flex items-center justify-center px-4">
              <Logo src={src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
