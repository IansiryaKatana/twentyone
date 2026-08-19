import logoLight from "@/Assets/light bg logo.png";
import logoDark from "@/Assets/logo white.png";
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
      className={cn("h-[3.6rem] w-auto object-contain object-left", className)}
      decoding="async"
    />
  );
}
