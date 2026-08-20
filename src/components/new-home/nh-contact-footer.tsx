import * as React from "react";
import { motion } from "motion/react";
import { newHome } from "@/data/content";
import { submitFormSubmission } from "@/lib/cms/contentAccess";
import { BrandButton } from "@/components/brand-button";
import { EASE, Reveal } from "@/components/anim";
import { FormSelect } from "@/components/form-select";
import { FormPhone } from "@/components/form-phone";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { useCmsContent } from "@/hooks/useCmsContent";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full border-0 border-b border-white/35 bg-transparent py-3 text-sm text-white outline-none transition-colors placeholder:text-white/55 focus:border-[var(--nh-red)]";

export function NhContactFooter() {
  const { contact } = newHome;
  const { sectionBackgrounds } = useCmsContent();
  const contactBg = sectionBackgrounds.newHomeContact;

  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitErr, setSubmitErr] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitErr(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    const result = await submitFormSubmission("new-home-contact", payload);
    setSubmitting(false);
    if (!result.ok) {
      setSubmitErr(result.error);
      return;
    }
    setSent(true);
    form.reset();
  };

  return (
    <section aria-label="Contact" className="bg-[var(--nh-black)]">
      <div className="grid w-full grid-cols-1 md:grid-cols-12 md:items-stretch">
        <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[22rem] md:col-span-7 md:min-h-full">
          <ResponsiveBgImage bg={contactBg} className="absolute inset-0" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
            aria-hidden
          />
          <h2 className="font-display absolute top-5 left-5 z-10 text-[clamp(2.73rem,calc(1.155rem+6.09vw),7.6125rem)] font-semibold uppercase leading-[0.95] text-white md:top-8 md:left-8 md:text-[clamp(2.184rem,calc(0.924rem+4.872vw),6.09rem)] lg:left-10 lg:top-10 lg:text-[clamp(2.73rem,calc(1.155rem+6.09vw),7.6125rem)] xl:text-[clamp(4.4625rem,7.56vw,7.6125rem)]">
            {contact.title}
          </h2>
        </div>

        <div className="flex flex-col bg-[var(--nh-panel)] px-5 py-14 md:col-span-5 md:min-h-full md:px-10 md:py-16 lg:px-12">
          <Reveal>
            <p className="mb-8 text-xs uppercase tracking-[0.3em] text-white/70">
              {contact.formTitle}
            </p>
          </Reveal>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <h3 className="font-display text-3xl font-medium uppercase text-white md:text-4xl">
                Message received
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Thank you. Our studio will be in touch shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-8 text-sm text-white underline underline-offset-4 hover:text-[var(--nh-red)]"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-7">
              {contact.fields.map((field) => {
                if (field.type === "select") {
                  return (
                    <FormSelect
                      key={field.id}
                      id={field.id}
                      name={field.id}
                      label={field.label}
                      placeholder={field.placeholder}
                      options={field.options ?? []}
                      required={field.required}
                      tone="dark"
                    />
                  );
                }

                if (field.type === "tel") {
                  return (
                    <FormPhone
                      key={field.id}
                      id={field.id}
                      name={field.id}
                      label={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                      tone="dark"
                    />
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <label key={field.id} className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                        {field.label}
                      </span>
                      <textarea
                        id={field.id}
                        name={field.id}
                        required={field.required}
                        placeholder={field.placeholder}
                        rows={3}
                        className={cn(fieldClass, "resize-none")}
                      />
                    </label>
                  );
                }

                return (
                  <label key={field.id} className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                      {field.label}
                    </span>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      className={fieldClass}
                    />
                  </label>
                );
              })}

              <BrandButton type="submit" disabled={submitting} className="mt-2 w-fit">
                {submitting ? "Sending…" : contact.submit}
              </BrandButton>
              {submitErr ? (
                <p className="text-sm text-[var(--nh-red)]">{submitErr}</p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
