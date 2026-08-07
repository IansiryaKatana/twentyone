import { contactPage } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { InquiryForm } from "@/components/inquiry-form";
import { Reveal, Stagger, StaggerItem } from "@/components/anim";

export function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={[...contactPage.title]}
        description={contactPage.description}
        className="bg-white"
      />

      <section className="bg-white pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10 lg:gap-16">
          <div className="md:col-span-7">
            <Reveal>
              <p className="mb-8 max-w-lg text-sm leading-relaxed text-muted-ink">
                {contactPage.body}
              </p>
              <InquiryForm />
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Stagger
              stagger={0.1}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1"
            >
              {contactPage.details.map((block) => (
                <StaggerItem key={block.label}>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-ink">
                    {block.label}
                  </p>
                  <div className="mt-2 space-y-0.5 text-sm text-ink">
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
    </PageShell>
  );
}
