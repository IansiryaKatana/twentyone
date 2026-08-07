import { NhHeader } from "@/components/new-home/nh-header";
import { NhContactFooter } from "@/components/new-home/nh-contact-footer";
import { SiteFooter } from "@/components/sections/site-footer";
import { PrHero } from "@/components/projects/pr-hero";
import { PrPhilosophy } from "@/components/projects/pr-philosophy";
import { PrPortfolio } from "@/components/projects/pr-portfolio";

export function ProjectsPage() {
  return (
    <div className="relative min-h-screen bg-[var(--nh-black)]">
      <NhHeader variant="overlay" />
      <main>
        {/* Sticky stack: hero pins, philosophy overlays, then releases */}
        <div className="relative">
          <PrHero />
          <PrPhilosophy />
        </div>
        <div className="relative z-20 bg-[var(--nh-black)]">
          <PrPortfolio />
          <NhContactFooter />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
