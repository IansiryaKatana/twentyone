import partner01 from "@/Assets/partners/partner-01.png";
import partner02 from "@/Assets/partners/partner-02.png";
import partner03 from "@/Assets/partners/partner-03.png";
import partner04 from "@/Assets/partners/partner-04.png";
import partner05 from "@/Assets/partners/partner-05.png";
import partner06 from "@/Assets/partners/partner-06.png";
import partner07 from "@/Assets/partners/partner-07.png";
import partner08 from "@/Assets/partners/partner-08.png";
import partner09 from "@/Assets/partners/partner-09.png";
import partner10 from "@/Assets/partners/partner-10.png";
import partner11 from "@/Assets/partners/partner-11.png";
import partner13 from "@/Assets/partners/partner-13.png";
import partner14 from "@/Assets/partners/partner-14.png";
import partner15 from "@/Assets/partners/partner-15.png";
import partner16 from "@/Assets/partners/partner-16.png";
import partner17 from "@/Assets/partners/partner-17.png";
import partner18 from "@/Assets/partners/partner-18.png";
import partner19 from "@/Assets/partners/partner-19.png";
import partner20 from "@/Assets/partners/partner-20.png";
import partner21 from "@/Assets/partners/partner-21.png";
import partner22 from "@/Assets/partners/partner-22.png";
import partner23 from "@/Assets/partners/partner-23.png";
import partner24 from "@/Assets/partners/partner-24.png";
import partner25 from "@/Assets/partners/partner-25.png";
import partner26 from "@/Assets/partners/partner-26.png";
import { partnersSection } from "@/data/content";
import { Reveal } from "@/components/anim";
import { NhSectionTitle } from "@/components/new-home/nh-section-title";

const logos = [
  partner01,
  partner02,
  partner03,
  partner04,
  partner05,
  partner06,
  partner07,
  partner08,
  partner09,
  partner10,
  partner11,
  partner13,
  partner14,
  partner15,
  partner16,
  partner17,
  partner18,
  partner19,
  partner20,
  partner21,
  partner22,
  partner23,
  partner24,
  partner25,
  partner26,
];

function Logo({ src }: { src: string }) {
  return (
    <span className="relative flex h-14 items-center md:h-20">
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
        <Reveal className="flex justify-center">
          <NhSectionTitle title={partnersSection.title} tone="dark" accent="black" lockup={false} />
        </Reveal>

        <div className="marquee-strip relative mt-10 overflow-hidden md:hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--nh-red)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--nh-red)] to-transparent" />
          <div className="marquee-track">
            {row.map((src, i) => (
              <span
                key={`${src}-${i}`}
                className="flex shrink-0 items-center justify-center px-8"
                aria-hidden={i >= logos.length}
              >
                <Logo src={src} />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 hidden grid-cols-3 gap-x-10 gap-y-10 md:grid lg:grid-cols-5 lg:gap-x-12 lg:gap-y-14">
          {logos.map((src) => (
            <div key={src} className="flex items-center justify-center px-3">
              <Logo src={src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
