import logo01 from "@/Assets/Partners-and-clients01.png";
import logo02 from "@/Assets/Partners-and-clients02-1024x207.png";
import logo03 from "@/Assets/Partners-and-clients03-1024x528.png";
import logo04 from "@/Assets/Partners-and-clients04.png";
import logo05 from "@/Assets/Partners-and-clients05-1024x358.png";
import logo06 from "@/Assets/Partners-and-clients06-1024x512.png";
import logo07 from "@/Assets/Partners-and-clients07-1024x434.png";
import logo09 from "@/Assets/Partners-and-clients09-1024x348.png";
import logo11 from "@/Assets/Partners-and-clients11-1024x386.png";

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
      {/* invisible image holds the natural aspect ratio / box width */}
      <img
        src={src}
        alt="Partner logo"
        className="h-full w-auto opacity-0"
        loading="lazy"
        draggable={false}
        aria-hidden
      />
      {/* crimson fill masked to the logo shape */}
      <span
        aria-hidden
        className="absolute inset-0 bg-crimson opacity-90 transition-opacity duration-300 hover:opacity-100"
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
  // Duplicate the set so the -50% translate loops seamlessly.
  const row = [...logos, ...logos];

  return (
    <section
      aria-label="Our partners and clients"
      className="marquee-strip relative w-full overflow-hidden bg-cream py-8 md:py-10"
    >
      {/* soft edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent md:w-28" />

      <div className="marquee-track">
        {row.map((src, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center justify-center px-8 md:px-12"
            aria-hidden={i >= logos.length}
          >
            <Logo src={src} />
          </span>
        ))}
      </div>
    </section>
  );
}
