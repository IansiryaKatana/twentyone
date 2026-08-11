import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { newHome } from "@/data/content";
import { submitFormSubmission } from "@/lib/cms/contentAccess";
import { EASE, Reveal } from "@/components/anim";
import { FormSelect } from "@/components/form-select";
import { FormPhone } from "@/components/form-phone";
import { ResponsiveBgImage } from "@/components/responsive-bg-image";
import { useCmsContent } from "@/hooks/useCmsContent";
import { cn } from "@/lib/utils";
import flyGraphic from "@/Assets/fly.png";

const fieldClass =
  "w-full border-0 border-b border-white/35 bg-transparent py-3 text-sm text-white outline-none transition-colors placeholder:text-white/55 focus:border-[var(--nh-red)]";

export function NhContactFooter({
  variant = "default",
}: {
  /**
   * `home` — desktop: form left (~40%) + CMS image right (~60%).
   * Mobile/tablet and other pages keep the red CTA + form layout.
   */
  variant?: "default" | "home";
}) {
  const { contact } = newHome;
  const { sectionBackgrounds } = useCmsContent();
  const contactBg = sectionBackgrounds.newHomeContact;
  const homeLayout = variant === "home";

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

  const redCta = (
    <div
      className={cn(
        "relative flex min-h-[28rem] flex-col justify-between overflow-hidden bg-[var(--nh-red)] px-5 py-12 md:col-span-5 md:min-h-full md:px-10 md:py-14 lg:px-12",
        homeLayout && "lg:hidden",
      )}
    >
      <Reveal className="relative z-10">
        <h2 className="font-display max-w-[14ch] text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.02] text-white">
          {contact.ctaTitle.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </Reveal>

      <Reveal delay={0.15} className="relative z-10 mt-10">
        <Link
          to={contact.ctaTo}
          className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-white"
        >
          {contact.ctaButton}
          <span className="flex size-10 items-center justify-center rounded-md border border-white/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[var(--nh-red)]">
            <ArrowRight className="size-4" />
          </span>
        </Link>
      </Reveal>

      <img
        src={flyGraphic}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[58%] w-auto max-w-[95%] object-contain object-bottom-right drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:h-[72%]"
      />
    </div>
  );

  const formPanel = (
    <div
      className={cn(
        "flex flex-col bg-[var(--nh-panel)] px-5 py-14 md:col-span-7 md:min-h-full md:px-10 md:py-16 lg:px-12",
        homeLayout && "lg:col-span-5",
      )}
    >
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
            Thank you — our studio will be in touch shortly.
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

          <button
            type="submit"
            disabled={submitting}
            className="group mt-2 inline-flex w-fit items-center gap-2 rounded-md bg-[var(--nh-red)] py-2.5 pl-5 pr-2.5 text-sm uppercase tracking-[0.18em] text-white transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting ? "Sending…" : contact.submit}
            <span className="flex size-8 items-center justify-center rounded-md bg-white text-[var(--nh-red)]">
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </button>
          {submitErr ? (
            <p className="text-sm text-[var(--nh-red)]">{submitErr}</p>
          ) : null}
        </form>
      )}
    </div>
  );

  return (
    <section aria-label="Contact" className="bg-[var(--nh-black)]">
      <div className="grid w-full grid-cols-1 md:grid-cols-12 md:items-stretch">
        {homeLayout ? (
          <>
            {redCta}
            {formPanel}
            <div className="relative hidden min-h-full overflow-hidden lg:col-span-7 lg:block">
              <ResponsiveBgImage bg={contactBg} className="absolute inset-0" />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
                aria-hidden
              />
            </div>
          </>
        ) : (
          <>
            {redCta}
            {formPanel}
          </>
        )}
      </div>
    </section>
  );
}
