import { PageShell } from "@/components/page-shell";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Stats } from "@/components/sections/stats";
import { Showcase } from "@/components/sections/showcase";
import { Services } from "@/components/sections/services";
import { NewListings } from "@/components/sections/new-listings";
import { Partners } from "@/components/sections/partners";
import { Journal } from "@/components/sections/journal";

export function LandingPage() {
  return (
    <PageShell headerVariant="overlay">
      <Hero />
      <About />
      <Stats />
      <Showcase />
      <Services />
      <NewListings />
      <Partners />
      <Journal />
    </PageShell>
  );
}
