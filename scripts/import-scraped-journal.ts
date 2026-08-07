/**
 * Import scraped blog articles from Website content scrapper/website 1
 * into journal posts + public/journal images, then regenerate CMS seed.
 *
 * Run: npx tsx scripts/import-scraped-journal.ts
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCRAPE_ROOT = resolve(
  ROOT,
  "..",
  "Website content scrapper",
  "website 1",
);
const ARTICLES_DIR = join(SCRAPE_ROOT, "articles");
const PUBLIC_JOURNAL = join(ROOT, "public", "journal");
const OUT_FILE = join(ROOT, "src", "data", "journal-posts.generated.ts");

type Meta = {
  url: string;
  title: string;
  date: string;
  excerpt: string;
  thumbnail_local?: string;
  images_local?: string[];
};

const TAG_BY_SLUG: Record<string, string> = {
  "retail-design-to-young-talent-twentyone06-celebrates-double-victory-at-cid-awards-mena-2025":
    "Awards",
  "twentyone06-nominated-among-top-10-fb-hospitality-design-studios-pro-chef-hospitality-awards-2025":
    "Awards",
  "dental-nation-by-twentyone06-shortlisted-for-interior-design-of-the-year-health-wellness-at-cid-awards-2025-mena":
    "Awards",
  "twentyone06-shortlisted-across-5-categories-at-cid-awards-2025-mena":
    "Awards",
  "dental-nation-interior-design-twentyone06-transforms-polyclinic-to-premium-care-destination":
    "Health & Wellness",
  "twentyone06-emerges-as-regional-leader-at-cid-awards-2025-hospitality-with-four-major-wins":
    "Awards",
  "can-you-do-this-quicker-dubai-interior-designers-answer-the-burning-age-old-question":
    "Insights",
  "design-storytelling-press-at-twentyone06-2024-for-far-4": "Hospitality",
  "design-storytelling-press-at-twentyone06-2024-for-far-3": "Insights",
  "design-storytelling-press-at-twentyone06-2024-for-far-2": "Hospitality",
  "design-storytelling-press-at-twentyone06-2024-for-far": "Studio News",
};

function slugFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/^\/|\/$/g, "");
    return path || "untitled";
  } catch {
    return "untitled";
  }
}

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw.trim();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(Number.parseInt(h, 16)),
    );
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|h[1-6]|li|div)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function extractBodyFromHtml(html: string): string[] {
  const blocks: string[] = [];
  const re = /<(p|h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const text = stripTags(match[2]);
    if (!text || text.length < 2) continue;
    // Skip near-empty spacer paragraphs
    if (/^[\s.]*$/.test(text)) continue;
    blocks.push(text);
  }
  return blocks;
}

function extractBodyFromMarkdown(md: string): string[] {
  const idx = md.indexOf("## Content");
  const content = idx >= 0 ? md.slice(idx + "## Content".length) : md;
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("![") && !l.startsWith("# "));

  // Join soft-wrapped lines into flowing paragraphs when no blank separators
  const paras: string[] = [];
  let buf = "";
  for (const line of lines) {
    const looksLikeHeading =
      /^(Award Highlights|WINNER|Key Design Strategies|A Milestone|Govind|Mike|Read more)/i.test(
        line,
      ) ||
      (/^[A-Z0-9].{0,80}$/.test(line) && !line.endsWith(".") && line.length < 90);

    if (looksLikeHeading && buf) {
      paras.push(buf.trim());
      buf = line;
      continue;
    }
    buf = buf ? `${buf} ${line}` : line;
  }
  if (buf.trim()) paras.push(buf.trim());
  return paras.filter((p) => p.length > 1);
}

function tsString(s: string): string {
  return JSON.stringify(s);
}

function safeImageName(slug: string, srcPath: string): string {
  const ext = extname(srcPath).toLowerCase() || ".jpg";
  const base = slug.slice(0, 60).replace(/[^a-z0-9-]+/gi, "-");
  return `${base}${ext}`;
}

function main() {
  if (!existsSync(ARTICLES_DIR)) {
    throw new Error(`Scraped articles not found at ${ARTICLES_DIR}`);
  }

  mkdirSync(PUBLIC_JOURNAL, { recursive: true });

  const folders = readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const posts: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    tag: string;
    image: string;
    body: string[];
    featured?: boolean;
    sortDate: number;
  }[] = [];

  for (const folder of folders) {
    const dir = join(ARTICLES_DIR, folder);
    const metaPath = join(dir, "metadata.json");
    const htmlPath = join(dir, "content.html");
    const mdPath = join(dir, "article.md");
    if (!existsSync(metaPath)) continue;

    const meta = JSON.parse(readFileSync(metaPath, "utf8")) as Meta;
    const slug = slugFromUrl(meta.url);
    const title = meta.title.trim();
    const excerpt = (meta.excerpt || "").trim();
    const date = formatDate(meta.date || "");
    const tag = TAG_BY_SLUG[slug] ?? "Studio News";

    let body: string[] = [];
    if (existsSync(htmlPath)) {
      body = extractBodyFromHtml(readFileSync(htmlPath, "utf8"));
    }
    if (body.length < 2 && existsSync(mdPath)) {
      body = extractBodyFromMarkdown(readFileSync(mdPath, "utf8"));
    }
    if (body.length === 0 && excerpt) body = [excerpt];

    const thumbRel = meta.thumbnail_local || meta.images_local?.[0];
    if (!thumbRel) {
      console.warn(`No image for ${slug}`);
      continue;
    }
    const srcImage = resolve(dir, thumbRel);
    if (!existsSync(srcImage)) {
      console.warn(`Missing image file for ${slug}: ${srcImage}`);
      continue;
    }

    const imageName = safeImageName(slug, srcImage);
    const destImage = join(PUBLIC_JOURNAL, imageName);
    copyFileSync(srcImage, destImage);
    const image = `/journal/${imageName}`;

    const sortDate = new Date(meta.date).getTime() || 0;

    posts.push({
      slug,
      title,
      excerpt,
      date,
      tag,
      image,
      body,
      sortDate,
    });

    console.log(`✓ ${slug} (${body.length} paras) ← ${basename(srcImage)}`);
  }

  // Newest first; feature the newest
  posts.sort((a, b) => b.sortDate - a.sortDate);
  if (posts[0]) posts[0].featured = true;

  const lines: string[] = [];
  lines.push(
    "/** Auto-generated by scripts/import-scraped-journal.ts — do not edit by hand. */",
  );
  lines.push("");
  lines.push("export const scrapedJournalPosts = [");

  for (const p of posts) {
    lines.push("  {");
    lines.push(`    slug: ${tsString(p.slug)},`);
    lines.push(`    title: ${tsString(p.title)},`);
    lines.push(`    excerpt: ${tsString(p.excerpt)},`);
    lines.push(`    date: ${tsString(p.date)},`);
    lines.push(`    tag: ${tsString(p.tag)},`);
    lines.push(`    image: ${tsString(p.image)},`);
    if (p.featured) lines.push("    featured: true,");
    lines.push("    body: [");
    for (const para of p.body) {
      lines.push(`      ${tsString(para)},`);
    }
    lines.push("    ],");
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
  console.log(`\nWrote ${posts.length} posts → ${OUT_FILE}`);
  console.log(`Images → ${PUBLIC_JOURNAL}`);

  // Regenerate CMS seed from content.ts (after wiring import)
  try {
    execSync("npx tsx scripts/generate-cms-seed.ts", {
      cwd: ROOT,
      stdio: "inherit",
    });
  } catch {
    console.warn("Seed generation deferred — wire content.ts then re-run generate-cms-seed.");
  }
}

main();
