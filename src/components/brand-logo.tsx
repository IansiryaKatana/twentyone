import logoLight from "@/Assets/light bg logo.png";
import logoDark from "@/Assets/Dark  bg logo.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** Background behind the logo — picks the matching asset. */
  surface: "light" | "dark";
  className?: string;
};

export function BrandLogo({ surface, className }: BrandLogoProps) {
  return (
    <img
      src={surface === "light" ? logoLight : logoDark}
      alt="Twentyone06"
      width={979}
      height={198}
      className={cn("h-7 w-auto object-contain object-left sm:h-8 md:h-9", className)}
      decoding="async"
    />
  );
}
