import * as React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { contactPage } from "@/data/content";
import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/anim";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-0 border-b border-line bg-transparent py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-ink/50 focus:border-ink";

export function ContactPage() {
  const [sent, setSent] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hardcoded UI — no backend yet; acknowledge the inquiry locally.
    setSent(true);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        description={contactPage.description}
      />

      <section className="bg-cream pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:px-10 lg:gap-16">
          {/* Form */}
          <div className="md:col-span-7">
            <Reveal>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="rounded-lg border border-line bg-cream-2 p-8 md:p-10"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-ink">
                    Message received
                  </p>
                  <h2 className="font-display mt-4 text-3xl font-normal uppercase text-ink md:text-4xl">
                    Thank you — we’ll be in touch shortly.
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-ink">
                    Our studio reviews every inquiry personally. Expect a response within two business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 text-sm text-ink underline underline-offset-4 transition-colors hover:text-crimson"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {contactPage.form.fields
                      .filter((f) => f.type !== "textarea" && f.type !== "select")
                      .map((field) => (
                        <label key={field.id} className="flex flex-col gap-2">
                          <span className="text-xs uppercase tracking-[0.25em] text-muted-ink">
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

                  {contactPage.form.fields
                    .filter((f) => f.type === "select")
                    .map((field) => (
                      <label key={field.id} className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.25em] text-muted-ink">
                          {field.label}
                        </span>
                        <select
                          id={field.id}
                          name={field.id}
                          required={field.required}
                          defaultValue=""
                          className={cn(inputClass, "appearance-none")}
                        >
                          <option value="" disabled>
                            {field.placeholder}
                          </option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}

                  {contactPage.form.fields
                    .filter((f) => f.type === "textarea")
                    .map((field) => (
                      <label key={field.id} className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.25em] text-muted-ink">
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

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-sm text-xs leading-relaxed text-muted-ink">
                      {contactPage.form.note}
                    </p>
                    <button
                      type="submit"
                      className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-espresso py-2 pl-6 pr-2 text-sm text-cream transition-colors hover:bg-crimson"
                    >
                      {contactPage.form.submit}
                      <span className="flex size-8 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>

          {/* Details + image */}
          <div className="md:col-span-5">
            <Stagger stagger={0.1} className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-1">
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

            <Reveal delay={0.2} y={36} className="mt-10 overflow-hidden rounded-md">
              <motion.img
                src={contactPage.image}
                alt="Twentyone06 studio interior"
                className="aspect-[4/5] w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
