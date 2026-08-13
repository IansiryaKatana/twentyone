import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { footer } from "@/data/content";
import { BrandButton } from "@/components/brand-button";
import { LinesReveal, Reveal } from "@/components/anim";
import { submitFormSubmission } from "@/lib/cms/contentAccess";
import { sendTransactionalEmail } from "@/lib/cms/sendContactThankYou";

export function SiteFooter({ showCta = false }: { showCta?: boolean }) {
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitErr, setSubmitErr] = React.useState<string | null>(null);

  const onNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitErr(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!email) {
      setSubmitting(false);
      setSubmitErr("Please enter your email.");
      return;
    }
    const result = await submitFormSubmission("newsletter", { email });
    if (!result.ok) {
      setSubmitting(false);
      setSubmitErr(result.error);
      return;
    }
    void sendTransactionalEmail({ email, kind: "newsletter" });
    setSubmitting(false);
    setSent(true);
    form.reset();
  };

  return (
    <footer id="footer" className="relative overflow-hidden bg-black text-white">
      <div className="w-full px-5 pb-8 pt-20 md:px-10 md:pt-28 lg:px-[7vw]">
        {showCta && (
          <>
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <LinesReveal
                as="h2"
                lines={footer.cta.title}
                className="font-display max-w-2xl text-[clamp(1.8rem,3.6vw,3.2rem)] font-medium leading-[1.05] text-white"
              />
              <Reveal delay={0.15} className="flex flex-col items-start md:items-end">
                <div className="inline-flex w-full flex-col items-stretch gap-4 sm:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {footer.cta.avatars.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="size-9 rounded-full border-2 border-black object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white/70">{footer.cta.members}</span>
                  </div>
                  <BrandButton to={footer.cta.buttonTo} variant="white" className="w-full">
                    {footer.cta.button}
                  </BrandButton>
                </div>
              </Reveal>
            </div>

            <div className="my-12 h-px w-full bg-white/15" />
          </>
        )}

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* The Hive + Follow Us */}
          <div>
            <h2 className="font-display mb-3 text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.02] text-white">
              {footer.hiveTitle}
            </h2>
            <a
              href={footer.hiveMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-detective mb-8 inline-block text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.3] text-white/85 transition-colors hover:text-white"
            >
              {footer.hiveCta}
            </a>
            {footer.columns[0] ? (
              <>
                <h3 className="font-display mb-4 text-[clamp(1.85rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-white">
                  {footer.columns[0].title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {footer.columns[0].links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={"href" in link ? link.href : "#"}
                        {...(typeof link.href === "string" && link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group inline-flex items-center gap-1.5 text-sm text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                        {footer.columns[0].arrow ? (
                          <ArrowUpRight className="size-3.5 text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          {/* Quick Links */}
          {footer.columns.slice(1).map((col) => (
            <div key={col.title}>
              <h3 className="font-display mb-4 text-[clamp(1.85rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-white">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"to" in link && link.to ? (
                      <Link
                        to={link.to as "/"}
                        {...("params" in link && link.params
                          ? { params: link.params as Record<string, string> }
                          : {})}
                        {...("hash" in link && link.hash ? { hash: link.hash } : {})}
                        className="font-detective group inline-flex items-center gap-1.5 text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.3] text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                        {"arrow" in col && col.arrow ? (
                          <ArrowUpRight className="size-3.5 text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                        ) : null}
                      </Link>
                    ) : (
                      <a
                        href={"href" in link ? link.href : "#"}
                        className="font-detective group inline-flex items-center gap-1.5 text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.3] text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location */}
          <div>
            <h3 className="font-display mb-4 text-[clamp(1.85rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-white">
              {footer.location.title}
            </h3>
            <address className="font-detective not-italic text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.35] text-white/85">
              {footer.location.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </address>
            <h3 className="font-display mb-2 mt-5 text-[clamp(1.85rem,4.2vw,3.5rem)] font-medium leading-[0.92] text-white">
              {footer.location.callTitle}
            </h3>
            <a
              href={footer.location.phoneHref}
              className="font-detective text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.3] text-white/85 transition-colors hover:text-white"
            >
              {footer.location.phone}
            </a>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display mb-6 text-[clamp(2.75rem,5vw,5.25rem)] font-semibold leading-[1.02] text-white">
              {footer.newsletter.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h3>
            {sent ? (
              <p className="text-sm text-white/70">{footer.newsletter.success}</p>
            ) : (
              <form onSubmit={(e) => void onNewsletterSubmit(e)} className="flex flex-col gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-white/75">
                    {footer.newsletter.emailLabel}
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={footer.newsletter.emailPlaceholder}
                    className="w-full border-0 border-b border-white/35 bg-transparent py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/55 focus:border-[var(--nh-red,#e01e26)]"
                  />
                </label>
                <BrandButton
                  type="submit"
                  disabled={submitting}
                  variant="white"
                  className="w-full"
                >
                  {submitting ? "Sending…" : footer.newsletter.cta}
                </BrandButton>
                {submitErr ? <p className="text-xs text-red-400">{submitErr}</p> : null}
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 text-xs text-white/50 md:grid-cols-4 md:items-center md:gap-8">
          <span className="md:col-span-3">{footer.copyright}</span>
          <div className="flex items-center gap-5 md:col-start-4 md:justify-self-start">
            {footer.legal.map((item) =>
              "to" in item && item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={"href" in item ? item.href : "#"}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
