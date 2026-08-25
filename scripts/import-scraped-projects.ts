/**
 * Scrape projects from twentyone06.com WP REST API, download images,
 * generate src/data/projects.generated.ts, and upsert into Supabase.
 *
 * Does not change projects page UI.
 *
 * Run: npx tsx scripts/import-scraped-projects.ts
 */
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public", "projects");
const OUT_FILE = join(ROOT, "src", "data", "projects.generated.ts");
const API =
  "https://twentyone06.com/wp-json/wp/v2/project?per_page=100&_embed=1";

type WpTerm = { id: number; name: string; slug: string; taxonomy: string };
type WpMedia = { source_url?: string; media_details?: { sizes?: Record<string, { source_url?: string }> } };
type WpProject = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  project_category?: number[];
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

type ServiceSlug =
  | "interior-design"
  | "branding"
  | "design-management"
  | "design-strategy";

type ProjectSector =
  | "F&B"
  | "Hotels and Hospitality"
  | "Retail"
  | "Commercial"
  | "Healthcare"
  | "Workspace";

type GeneratedProject = {
  slug: string;
  title: string;
  location: string;
  price: string;
  category: "Residential" | "Hospitality" | "Commercial";
  sector?: ProjectSector;
  services: ServiceSlug[];
  year: string;
  client: string;
  area: string;
  status: string;
  duration: string;
  typologies: string[];
  scope: string[];
  materials: string[];
  finishes: string[];
  credits: { role: string; name: string }[];
  challenge: string;
  approach: string;
  outcome: string;
  excerpt: string;
  body: string[];
  hero: string;
  gallery: string[];
  span: "tall" | "short" | "wide";
};

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(Number.parseInt(n, 16)),
    )
    .replace(/[\u2013\u2014]/g, "-");
}

function stripTags(html: string): string {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  );
}

function extractParagraphs(html: string): string[] {
  const fromP = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1] ?? "").trim())
    .filter((p) => p.length > 40 && !/^filter by/i.test(p));

  if (fromP.length > 0) return fromP.slice(0, 8);

  return stripTags(html)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)
    .slice(0, 8);
}

function mainContentHtml(html: string): string {
  // Drop Elementor "Related projects" carousels / footers that leak other project images
  const cut = html.search(
    /Related projects|related-projects|loop-carousel/i,
  );
  return cut > 0 ? html.slice(0, cut) : html;
}

function extractImageUrls(html: string, featured?: string): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  const push = (url?: string) => {
    if (!url) return;
    const next = preferredImageUrl(url);
    if (seen.has(next)) return;
    seen.add(next);
    urls.push(next);
  };
  push(featured);
  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src)="(https:\/\/twentyone06\.com\/wp-content\/uploads\/[^"]+)"/gi,
  )) {
    push(m[1]);
  }
  return urls;
}

function preferredImageUrl(url: string): string {
  // Drop tiny thumbs; keep scaled/full
  if (/-(\d+x\d+)\.(jpe?g|png|webp)$/i.test(url)) {
    const full = url.replace(/-\d+x\d+(\.(jpe?g|png|webp))$/i, "$1");
    return full;
  }
  return url;
}

function slugifyFilename(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  if (existsSync(destPath)) return;
  const res = await fetch(url, {
    headers: { "User-Agent": "Twentyone06Importer/1.0" },
  });
  if (!res.ok || !res.body) {
    throw new Error(`Failed download ${url}: ${res.status}`);
  }
  // @ts-expect-error Node fetch body is a web stream
  await pipeline(Readable.fromWeb(res.body), createWriteStream(destPath));
}

function mapCategory(slugs: string[]): {
  category: GeneratedProject["category"];
  sector?: ProjectSector;
  services: ServiceSlug[];
  typologies: string[];
} {
  const set = new Set(slugs);
  const typologies = slugs.map((s) =>
    s
      .split("-")
      .map((w) => w.toUpperCase() === "FB" ? "F&B" : w[0]!.toUpperCase() + w.slice(1))
      .join(" "),
  );

  let sector: ProjectSector | undefined;
  if (set.has("fb-design")) sector = "F&B";
  else if (set.has("hospitality-design")) sector = "Hotels and Hospitality";
  else if (set.has("retail-design")) sector = "Retail";
  else if (set.has("healthcare-design")) sector = "Healthcare";
  else if (set.has("commercial-design")) sector = "Commercial";
  else if (set.has("residential-design")) sector = undefined;

  let category: GeneratedProject["category"] = "Commercial";
  if (set.has("residential-design")) category = "Residential";
  else if (set.has("hospitality-design") || set.has("fb-design")) {
    category = "Hospitality";
  }

  const services = new Set<ServiceSlug>();
  if (set.has("branding")) services.add("branding");
  if (
    set.has("fb-design") ||
    set.has("hospitality-design") ||
    set.has("retail-design") ||
    set.has("healthcare-design") ||
    set.has("commercial-design") ||
    set.has("residential-design")
  ) {
    services.add("interior-design");
  }
  if (services.size === 0) services.add("interior-design");

  return { category, sector, services: [...services], typologies };
}

function spanForIndex(i: number): GeneratedProject["span"] {
  return (["tall", "short", "wide"] as const)[i % 3]!;
}

function lit(value: string): string {
  return JSON.stringify(value);
}

async function main() {
  mkdirSync(PUBLIC_DIR, { recursive: true });

  console.log("Fetching projects from WordPress…");
  const res = await fetch(API, {
    headers: { "User-Agent": "Twentyone06Importer/1.0" },
  });
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  const items = (await res.json()) as WpProject[];
  console.log(`Found ${items.length} projects`);

  const generated: GeneratedProject[] = [];
  const imageMap = new Map<string, string>(); // remote -> local public path

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const title = decodeHtml(item.title.rendered).trim();
    const terms =
      item._embedded?.["wp:term"]?.flat().filter((t) => t.taxonomy === "project_category") ??
      [];
    const catSlugs = terms.map((t) => t.slug);
    const mapped = mapCategory(catSlugs);

    const featured =
      item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      item._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full
        ?.source_url ||
      "";

    const contentHtml = mainContentHtml(item.content.rendered);
    const remoteImages = extractImageUrls(contentHtml, featured);

    const localImages: string[] = [];
    for (const remote of remoteImages) {
      const cacheKey = `${item.slug}::${remote}`;
      if (imageMap.has(cacheKey)) {
        localImages.push(imageMap.get(cacheKey)!);
        continue;
      }
      const hash = createHash("md5").update(remote).digest("hex").slice(0, 8);
      const base = slugifyFilename(
        remote.split("/").pop()?.replace(/\.[^.]+$/, "") || item.slug,
      );
      const ext = extname(new URL(remote).pathname) || ".jpg";
      const filename = `${item.slug}-${base}-${hash}${ext}`.replace(
        /-{2,}/g,
        "-",
      );
      const dest = join(PUBLIC_DIR, filename);
      const publicPath = `/projects/${filename}`;
      try {
        process.stdout.write(`  ↓ ${filename}\n`);
        await downloadImage(remote, dest);
        imageMap.set(cacheKey, publicPath);
        localImages.push(publicPath);
      } catch (err) {
        console.warn(`  ! skip image ${remote}`, err);
      }
    }

    const paragraphs = extractParagraphs(contentHtml);
    const excerptRaw = item.excerpt?.rendered
      ? stripTags(item.excerpt.rendered)
      : paragraphs[0] ?? "";
    const excerpt =
      excerptRaw.slice(0, 220) + (excerptRaw.length > 220 ? "…" : "");

    const hero = localImages[0] ?? "";
    const gallery = localImages.slice(1, 13);
    // Ensure gallery has at least hero if only one image
    if (gallery.length === 0 && hero) gallery.push(hero);

    const year = item.date.slice(0, 4);
    const body =
      paragraphs.length > 0
        ? paragraphs
        : [
            `${title} is a TwentyOne06 project spanning ${mapped.typologies.join(", ") || "interior design"}.`,
          ];

    generated.push({
      slug: item.slug,
      title,
      location: "Dubai, UAE",
      price: "",
      category: mapped.category,
      ...(mapped.sector ? { sector: mapped.sector } : {}),
      services: mapped.services,
      year,
      client: title,
      area: "",
      status: "Completed",
      duration: "",
      typologies: mapped.typologies.length
        ? mapped.typologies
        : ["Interior Design"],
      scope: [],
      materials: [],
      finishes: [],
      credits: [{ role: "Studio", name: "TwentyOne06" }],
      challenge: body[0] ?? "",
      approach: body[1] ?? body[0] ?? "",
      outcome: body[2] ?? body[0] ?? "",
      excerpt: excerpt || title,
      body,
      hero,
      gallery,
      span: spanForIndex(i),
    });

    console.log(`✓ ${title} (${localImages.length} images)`);
  }

  const lines: string[] = [];
  lines.push(
    "/** Auto-generated by scripts/import-scraped-projects.ts - do not edit by hand. */",
  );
  lines.push("");
  lines.push("export const scrapedProjects = [");
  for (const p of generated) {
    lines.push("  {");
    lines.push(`    slug: ${lit(p.slug)},`);
    lines.push(`    title: ${lit(p.title)},`);
    lines.push(`    location: ${lit(p.location)},`);
    lines.push(`    price: ${lit(p.price)},`);
    lines.push(`    category: ${lit(p.category)},`);
    if (p.sector) lines.push(`    sector: ${lit(p.sector)},`);
    lines.push(`    services: ${JSON.stringify(p.services)},`);
    lines.push(`    year: ${lit(p.year)},`);
    lines.push(`    client: ${lit(p.client)},`);
    lines.push(`    area: ${lit(p.area)},`);
    lines.push(`    status: ${lit(p.status)},`);
    lines.push(`    duration: ${lit(p.duration)},`);
    lines.push(`    typologies: ${JSON.stringify(p.typologies)},`);
    lines.push(`    scope: ${JSON.stringify(p.scope)},`);
    lines.push(`    materials: ${JSON.stringify(p.materials)},`);
    lines.push(`    finishes: ${JSON.stringify(p.finishes)},`);
    lines.push(`    credits: ${JSON.stringify(p.credits)},`);
    lines.push(`    challenge: ${lit(p.challenge)},`);
    lines.push(`    approach: ${lit(p.approach)},`);
    lines.push(`    outcome: ${lit(p.outcome)},`);
    lines.push(`    excerpt: ${lit(p.excerpt)},`);
    lines.push(`    body: ${JSON.stringify(p.body)},`);
    lines.push(`    hero: ${lit(p.hero)},`);
    lines.push(`    gallery: ${JSON.stringify(p.gallery)},`);
    lines.push(`    span: ${lit(p.span)},`);
    lines.push("  },");
  }
  lines.push("] as const;");
  lines.push("");

  writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUT_FILE}`);

  // Upsert into Supabase if env is present
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.log(
      "No Supabase env - skipped DB upsert. Wire content.ts + run generate-cms-seed / admin import next.",
    );
    return;
  }

  const sb = createClient(url, key);
  console.log("Upserting into Supabase projects…");

  // Replace placeholder projects with scraped set
  const { error: delErr } = await sb
    .from("projects")
    .delete()
    .neq("slug", "__never__");
  if (delErr) {
    console.warn("Delete warning:", delErr.message);
  }

  const rows = generated.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    location: p.location,
    price: p.price,
    category: p.category,
    year: p.year,
    client: p.client,
    area: p.area,
    status: p.status,
    duration: p.duration,
    typologies: p.typologies,
    scope: p.scope,
    materials: p.materials,
    finishes: p.finishes,
    credits: p.credits,
    challenge: p.challenge,
    approach: p.approach,
    outcome: p.outcome,
    excerpt: p.excerpt,
    body: p.body,
    hero: p.hero,
    gallery: p.gallery,
    span: p.span,
    services: p.services,
    featured: i < 6,
    sort_order: i,
    published: true,
  }));

  const { error } = await sb.from("projects").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`Upserted ${rows.length} projects to Supabase`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
