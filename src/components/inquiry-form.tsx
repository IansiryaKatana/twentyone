import * as React from "react";
import { motion } from "motion/react";
import { contactPage } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import {
  submitFormSubmission,
  type SubmitFormResult,
} from "@/lib/cms/contentAccess";
import { sendContactThankYou } from "@/lib/cms/sendContactThankYou";
import { FormSelect } from "@/components/form-select";
import { FormPhone } from "@/components/form-phone";
import { EASE } from "@/components/anim";
import { cn } from "@/lib/utils";

const lightInput =
  "w-full border-0 border-b border-black/25 bg-transparent py-3 text-sm text-black outline-none transition-colors placeholder:text-black focus:border-black";

const darkInput =
  "w-full border-0 border-b border-white/35 bg-transparent py-3 text-sm text-white outline-none transition-colors placeholder:text-white/55 focus:border-[var(--nh-red)]";

type Tone = "light" | "dark";

export function InquiryForm({
  tone = "light",
  className,
  submitFullWidth = false,
}: {
  tone?: Tone;
  className?: string;
  /** Services page CTA: red full-width Submit. */
  submitFullWidth?: boolean;
}) {
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitErr, setSubmitErr] = React.useState<string | null>(null);
  const dark = tone === "dark";
  const inputClass = dark ? darkInput : lightInput;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitErr(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    const result: SubmitFormResult = await submitFormSubmission(
      "contact",
      payload
    );
    if (!result.ok) {
      setSubmitting(false);
      setSubmitErr(result.error);
      return;
    }

    const email = String(payload.email ?? "");
    const firstName = String(payload.firstName ?? "");
    if (email) {
      void sendContactThankYou({ email, firstName });
    }

    setSubmitting(false);
    setSent(true);
    form.reset();
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn(
          "rounded-lg border p-8 md:p-10",
          dark
            ? "border-white/15 bg-white/5"
            : "border-line bg-cream-2",
          className
        )}
      >
        <p
          className={cn(
            "text-xs uppercase tracking-[0.3em]",
            dark ? "text-white/45" : "text-muted-ink"
          )}
        >
          Message received
        </p>
        <h2
          className={cn(
            "font-display mt-4 text-3xl font-medium uppercase md:text-4xl",
            dark ? "text-white" : "text-ink"
          )}
        >
          Thank you — we’ll be in touch shortly.
        </h2>
        <p
          className={cn(
            "mt-4 max-w-md text-sm leading-relaxed",
            dark ? "text-white/60" : "text-muted-ink"
          )}
        >
          Every great project starts with a conversation. Expect a response from
          our studio soon.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className={cn(
            "mt-8 text-sm underline underline-offset-4 transition-colors",
            dark
              ? "text-white hover:text-[var(--nh-red)]"
              : "text-ink hover:text-crimson"
          )}
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const textFields = contactPage.form.fields.filter(
    (f) => f.type !== "textarea" && f.type !== "select" && f.type !== "tel"
  );
  const phoneField = contactPage.form.fields.find((f) => f.type === "tel");
  const industryField = contactPage.form.fields.find(
    (f) => f.id === "industry"
  );
  const selectFields = contactPage.form.fields.filter(
    (f) => f.type === "select" && f.id !== "industry"
  );
  const textareas = contactPage.form.fields.filter(
    (f) => f.type === "textarea"
  );

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={cn("flex flex-col gap-8", className)}
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {textFields.map((field) => (
          <label key={field.id} className="flex flex-col gap-2">
            <span
              className={cn(
                "text-xs uppercase tracking-[0.25em]",
                dark ? "text-white/70" : "text-black"
              )}
            >
              {field.label}
              {field.required ? "" : " · optional"}
            </span>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              className={inputClass}
            />
          </label>
        ))}
      </div>

      {(phoneField || industryField) && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {phoneField ? (
            <FormPhone
              id={phoneField.id}
              name={phoneField.id}
              label={phoneField.label}
              placeholder={phoneField.placeholder}
              required={phoneField.required}
              tone={tone}
            />
          ) : null}
          {industryField ? (
            <FormSelect
              id={industryField.id}
              name={industryField.id}
              label={industryField.label}
              placeholder={industryField.placeholder ?? "Select an option"}
              options={industryField.options ?? []}
              required={industryField.required}
              tone={tone}
            />
          ) : null}
        </div>
      )}

      {selectFields.map((field) => (
        <FormSelect
          key={field.id}
          id={field.id}
          name={field.id}
          label={field.label}
          placeholder={field.placeholder ?? "Select an option"}
          options={field.options ?? []}
          required={field.required}
          tone={tone}
        />
      ))}

      {textareas.map((field) => (
        <label key={field.id} className="flex flex-col gap-2">
          <span
            className={cn(
              "text-xs uppercase tracking-[0.25em]",
              dark ? "text-white/70" : "text-black"
            )}
          >
            {field.label}
          </span>
          <textarea
            id={field.id}
            name={field.id}
            rows={5}
            placeholder={field.placeholder}
            required={field.required}
            className={cn(inputClass, "resize-none")}
          />
        </label>
      ))}

      {submitFullWidth ? (
        <div className="flex flex-col gap-3">
          <BrandButton type="submit" disabled={submitting} className="w-full">
            {submitting ? "Sending…" : contactPage.form.submit}
          </BrandButton>
          {submitErr ? (
            <p className="text-sm text-crimson">{submitErr}</p>
          ) : null}
          <p
            className={cn(
              "text-xs leading-relaxed",
              dark ? "text-white/65" : "text-black"
            )}
          >
            {contactPage.form.note}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p
              className={cn(
                "max-w-sm text-xs leading-relaxed",
                dark ? "text-white/65" : "text-black"
              )}
            >
              {contactPage.form.note}
            </p>
            <BrandButton
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? "Sending…" : contactPage.form.submit}
            </BrandButton>
          </div>
          {submitErr ? (
            <p className="text-sm text-crimson">{submitErr}</p>
          ) : null}
        </div>
      )}
    </form>
  );
}
