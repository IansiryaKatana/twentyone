import { NhHeader } from "@/components/new-home/nh-header";
import { NhHero } from "@/components/new-home/nh-hero";
import { NhPhilosophy } from "@/components/new-home/nh-philosophy";
import { NhServices } from "@/components/new-home/nh-services";
import { NhProjects } from "@/components/new-home/nh-projects";
import { NhClients } from "@/components/new-home/nh-clients";
import { NhTestimonial } from "@/components/new-home/nh-testimonial";
import { NhJournal } from "@/components/new-home/nh-journal";
import { NhContactFooter } from "@/components/new-home/nh-contact-footer";
import { SiteFooter } from "@/components/sections/site-footer";

export function NewHomePage() {
  return (
    <div className="new-home relative min-h-screen">
      <NhHeader />
      <main>
        <NhHero />
        <NhPhilosophy />
        <NhServices />
        <NhProjects />
        <NhClients />
        <NhTestimonial />
        <NhJournal />
        <NhContactFooter variant="home" />
      </main>
      <SiteFooter />
    </div>
  );
}
