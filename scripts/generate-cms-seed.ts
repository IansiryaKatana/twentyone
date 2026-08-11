/**
 * Generates SQL seed from src/data/content.ts
 * Run: npx tsx scripts/generate-cms-seed.ts
 * Writes: supabase/seed/cms_content.sql
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  faqPage,
  footer,
  journalPosts,
  legalController,
  nav,
  newHome,
  privacyPage,
  projects,
  services,
  termsPage,
  aboutPage,
  contactPage,
} from "../src/data/content.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

function esc(value: string): string {
  return value.replace(/'/g, "''");
}

function jsonb(value: unknown): string {
  return `'${esc(JSON.stringify(value))}'::jsonb`;
}

function lit(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  return `'${esc(String(value))}'`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sectionsToHtml(
  sections: { title: string; paragraphs: string[] }[],
): string {
  return sections
    .map((section) => {
      const paras = section.paragraphs
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");
      return `<h2>${escapeHtml(section.title)}</h2>${paras}`;
    })
    .join("\n");
}

import { createHash } from "node:crypto";

function uuidFromSlug(slug: string, prefix: string): string {
  const hash = createHash("sha1").update(`${prefix}:${slug}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

const nhBySlug = Object.fromEntries(
  newHome.services.items.map((s) => [s.slug, s]),
);

const sql: string[] = [];
sql.push("-- Twentyone06 CMS content seed (generated from content.ts)");
sql.push("BEGIN;");
sql.push("DELETE FROM public.service_capabilities;");
sql.push("DELETE FROM public.services;");
sql.push("DELETE FROM public.faq_entries;");
sql.push("DELETE FROM public.faq_topics;");
sql.push("DELETE FROM public.journal_posts;");
sql.push("DELETE FROM public.projects;");
sql.push("DELETE FROM public.marketing_pages;");
sql.push("DELETE FROM public.site_settings;");
sql.push("DELETE FROM public.testimonials;");

// ---- Projects ----
projects.forEach((p, i) => {
  sql.push(`INSERT INTO public.projects (
  id, slug, title, location, price, category, year, client, area, status, duration,
  typologies, scope, materials, finishes, credits, challenge, approach, outcome,
  excerpt, body, hero, gallery, span, services, featured, sort_order, published
) VALUES (
  ${lit(uuidFromSlug(p.slug, "project"))}, ${lit(p.slug)}, ${lit(p.title)}, ${lit(p.location)}, ${lit(p.price)},
  ${lit(p.category)}, ${lit(p.year)}, ${lit(p.client)}, ${lit(p.area)}, ${lit(p.status)},
  ${lit(p.duration)}, ${jsonb(p.typologies)}, ${jsonb(p.scope)}, ${jsonb(p.materials)},
  ${jsonb(p.finishes)}, ${jsonb(p.credits)}, ${lit(p.challenge)}, ${lit(p.approach)},
  ${lit(p.outcome)}, ${lit(p.excerpt)}, ${jsonb(p.body)}, ${lit(p.hero)}, ${jsonb(p.gallery)},
  ${lit(p.span)}, ${jsonb(p.services)}, ${i < 4}, ${i}, true
);`);
});

// ---- Services + capabilities ----
services.tabs.forEach((tab, i) => {
  const nh = nhBySlug[tab.id];
  const sid = uuidFromSlug(tab.id, "service");
  sql.push(`INSERT INTO public.services (
  id, slug, label, index_label, title, description, detail, intro, bullets, cta, image, hero_image, sort_order, published
) VALUES (
  ${lit(sid)}, ${lit(tab.id)}, ${lit(tab.label)},
  ${lit(nh?.index ?? String(i + 1).padStart(2, "0"))},
  ${lit(nh?.title ?? tab.label)},
  ${lit(nh?.description ?? "")},
  ${lit(nh?.detail ?? "")},
  ${lit(nh?.detail ?? "")},
  ${jsonb(nh?.bullets ?? tab.items.map((x) => x.title))},
  ${lit(nh?.cta ?? "Learn more")},
  ${lit(nh?.image ?? tab.items[0]?.image ?? "")},
  ${lit(nh?.image ?? tab.items[0]?.image ?? "")},
  ${i}, true
);`);

  tab.items.forEach((item, j) => {
    sql.push(`INSERT INTO public.service_capabilities (
      id, service_id, index_label, title, description, image, sort_order, published
    ) VALUES (
      ${lit(uuidFromSlug(`${tab.id}-${item.index}`, "scap"))},
      ${lit(sid)},
      ${lit(item.index)},
      ${lit(item.title)},
      ${lit(item.description)},
      ${lit(item.image)},
      ${j}, true
    );`);
  });
});

// ---- FAQs ----
faqPage.categories.forEach((cat, i) => {
  const tid = uuidFromSlug(cat.id, "faqtopic");
  sql.push(`INSERT INTO public.faq_topics (id, slug, label, sort_order, published)
    VALUES (${lit(tid)}, ${lit(cat.id)}, ${lit(cat.label)}, ${i}, true);`);
  cat.items.forEach((item, j) => {
    sql.push(`INSERT INTO public.faq_entries (
      id, topic_id, question, answer, answer_html, link_label, link_to, sort_order, published
    ) VALUES (
      ${lit(uuidFromSlug(`${cat.id}-q${j}`, "faqentry"))},
      ${lit(tid)},
      ${lit(item.q)},
      ${lit(item.a)},
      ${lit(`<p>${escapeHtml(item.a).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`)},
      ${lit(item.link?.label ?? null)},
      ${lit(item.link?.to ?? null)},
      ${j}, true
    );`);
  });
});

// ---- Journal ----
journalPosts.forEach((p, i) => {
  const bodyHtml = p.body.map((para) => `<p>${escapeHtml(para)}</p>`).join("");
  sql.push(`INSERT INTO public.journal_posts (
    id, slug, title, excerpt, date, tag, image, body, body_html, featured, sort_order, published
  ) VALUES (
    ${lit(uuidFromSlug(p.slug, "journal"))}, ${lit(p.slug)}, ${lit(p.title)}, ${lit(p.excerpt)},
    ${lit(p.date)}, ${lit(p.tag)}, ${lit(p.image)}, ${jsonb(p.body)}, ${lit(bodyHtml)},
    ${Boolean(p.featured)}, ${i}, true
  );`);
});

// ---- Testimonials ----
newHome.testimonials.forEach((t, i) => {
  sql.push(`INSERT INTO public.testimonials (
    id, quote, name, role, image, status, sort_order, published
  ) VALUES (
    ${lit(uuidFromSlug(`${t.name}-${i}`, "testi"))}, ${lit(t.quote)}, ${lit(t.name)},
    ${lit(t.role)}, ${lit(t.image)}, 'approved', ${i}, true
  );`);
});

// ---- Marketing pages (legal + about + new-home chrome) ----
function marketingInsert(
  slug: string,
  title: string,
  content: unknown,
) {
  sql.push(`INSERT INTO public.marketing_pages (id, slug, title, content, published)
    VALUES (${lit(uuidFromSlug(slug, "mpage"))}, ${lit(slug)}, ${lit(title)}, ${jsonb(content)}, true);`);
}

marketingInsert("privacy", "Privacy Policy", {
  eyebrow: privacyPage.eyebrow,
  title: privacyPage.title,
  description: privacyPage.description,
  image: privacyPage.image ?? null,
  body_html: sectionsToHtml(privacyPage.sections),
  sections: privacyPage.sections,
  controller: privacyPage.controller,
});

marketingInsert("terms", "Terms and Conditions", {
  eyebrow: termsPage.eyebrow,
  title: termsPage.title,
  description: termsPage.description,
  image: termsPage.image ?? null,
  body_html: sectionsToHtml(termsPage.sections),
  sections: termsPage.sections,
  controller: termsPage.controller,
});

marketingInsert("about", "About", {
  eyebrow: aboutPage.eyebrow,
  title: aboutPage.title,
  description: aboutPage.description,
  body_html: aboutPage.story.map((p) => `<p>${escapeHtml(p)}</p>`).join(""),
  story: aboutPage.story,
  imageA: aboutPage.imageA,
  imageB: aboutPage.imageB,
  cta: aboutPage.cta,
});

marketingInsert("new-home", "New Home", newHome);

marketingInsert("contact", "Contact", {
  eyebrow: contactPage.eyebrow,
  title: contactPage.title,
  description: contactPage.description,
  image: contactPage.image,
  details: contactPage.details,
  form: contactPage.form,
});

// ---- Site settings ----
const settings: Record<string, unknown> = {
  brand: {
    name: "Twentyone06",
    primary: "#e01e26",
    surface: "#111111",
    background: "#f7f5f2",
    ink: "#1a1a1a",
    muted: "#6b6b6b",
    border: "#e5e2dc",
    cream: "#ffffff",
    espresso: "#1a1a1a",
    crimson: "#cc0001",
  },
  typography: {
    displayFont: "Zeuxis",
    bodyFont: "Inter Tight",
    displayWeight: 500,
    bodyWeight: 300,
  },
  contact: {
    email: footer.location.email,
    phone: footer.location.phone,
    phoneHref: footer.location.phoneHref,
    addressLines: footer.location.lines,
    studioTitle: footer.location.title,
  },
  legal_controller: legalController,
  social: footer.columns[0]?.links ?? [],
  nav,
  footer: {
    copyright: footer.copyright,
    cta: footer.cta,
    legal: footer.legal,
  },
  admin_theme: {
    primary: "#e01e26",
    surface: "#111111",
    radiusLg: "12px",
  },
};

for (const [key, value] of Object.entries(settings)) {
  sql.push(
    `INSERT INTO public.site_settings (key, value) VALUES (${lit(key)}, ${jsonb(value)});`,
  );
}

sql.push("COMMIT;");

const outPath = resolve(__dirname, "../supabase/seed/cms_content.sql");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, sql.join("\n"), "utf8");
console.log(`Wrote ${outPath} (${sql.length} statements)`);
