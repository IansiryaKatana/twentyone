import { contactPage } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { InquiryForm } from "@/components/inquiry-form";
import { Reveal, Stagger, StaggerItem } from "@/components/anim";
import { useCmsContent } from "@/hooks/useCmsContent";

export function ContactPage() {
  const { sectionBackgrounds } = useCmsContent();
  const bg = sectionBackgrounds.contact;

  return (
    <PageShell headerVariant="overlay">
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={[...contactPage.title]}
        description={contactPage.description}
        descriptionClassName="text-[clamp(0.945rem,1.4vw,1.225rem)]"
        image={bg.desktop}
        imageTablet={bg.tablet}
        imageMobile={bg.mobile}
      />

      <section className="bg-white pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10 lg:gap-16">
          <div className="md:col-span-7">
            <Reveal>
              <p className="mb-8 hidden max-w-lg text-sm leading-relaxed text-black md:block">
                {contactPage.body}
              </p>
              <InquiryForm submitFullWidth />
            </Reveal>
          </div>

          <div className="hidden md:col-span-5 md:block">
            <Stagger
              stagger={0.1}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1"
            >
              {contactPage.details.map((block) => (
                <StaggerItem key={block.label}>
                  <p className="text-[18px] uppercase tracking-[0.25em] text-crimson">
                    {block.label}
                  </p>
                  <div className="font-detective mt-2 space-y-0.5 text-[clamp(0.945rem,1.4vw,1.225rem)] font-medium leading-[1.15] text-black">
                    {block.lines.map((line) =>
                      "href" in block && block.href ? (
                        <a
                          key={line}
                          href={block.href}
                          className="block transition-colors hover:text-crimson"
                        >
                          {line}
                        </a>
                      ) : (
                        <div key={line}>{line}</div>
                      )
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section
        aria-label={contactPage.map.title}
        className="relative w-full overflow-hidden bg-[var(--nh-gray)]"
      >
        <div className="relative h-[min(70vw,720px)] min-h-[320px] w-full md:h-[720px]">
          <iframe
            title={contactPage.map.title}
            src={contactPage.map.embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
      </section>
    </PageShell>
  );
}
