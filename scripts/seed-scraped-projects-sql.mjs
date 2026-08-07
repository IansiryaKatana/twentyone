/**
 * Emit SQL to replace projects with scraped set (for Supabase MCP / psql).
 * Run: node scripts/seed-scraped-projects-sql.mjs > supabase/seed/part_projects_scraped.sql
 */
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const genPath = resolve(__dirname, "../src/data/projects.generated.ts");

// Dynamic import of generated TS via tsx-less approach: eval the array by stripping export
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const outPath = resolve(__dirname, "../supabase/seed/part_projects_scraped.sql");

const json = execSync(
  `npx tsx -e "import { scrapedProjects } from './src/data/projects.generated.ts'; console.log(JSON.stringify(scrapedProjects))"`,
  { cwd: resolve(__dirname, ".."), maxBuffer: 50 * 1024 * 1024, encoding: "utf8" },
);

const projects = JSON.parse(json.trim().split("\n").filter(Boolean).at(-1));

function esc(s) {
  return String(s ?? "").replace(/'/g, "''");
}
function lit(s) {
  return `'${esc(s)}'`;
}
function jsonb(v) {
  return `'${esc(JSON.stringify(v))}'::jsonb`;
}

const lines = [];
lines.push("-- Scraped projects from twentyone06.com/our-creations/");
lines.push("BEGIN;");
lines.push("DELETE FROM public.projects;");

projects.forEach((p, i) => {
  lines.push(`INSERT INTO public.projects (
  slug, title, location, price, category, year, client, area, status, duration,
  typologies, scope, materials, finishes, credits, challenge, approach, outcome,
  excerpt, body, hero, gallery, span, services, featured, sort_order, published
) VALUES (
  ${lit(p.slug)}, ${lit(p.title)}, ${lit(p.location)}, ${lit(p.price)},
  ${lit(p.category)}, ${lit(p.year)}, ${lit(p.client)}, ${lit(p.area)}, ${lit(p.status)},
  ${lit(p.duration)}, ${jsonb(p.typologies)}, ${jsonb(p.scope)}, ${jsonb(p.materials)},
  ${jsonb(p.finishes)}, ${jsonb(p.credits)}, ${lit(p.challenge)}, ${lit(p.approach)},
  ${lit(p.outcome)}, ${lit(p.excerpt)}, ${jsonb(p.body)}, ${lit(p.hero)}, ${jsonb(p.gallery)},
  ${lit(p.span)}, ${jsonb(p.services)}, ${i < 6}, ${i}, true
);`);
});

lines.push("COMMIT;");
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath} (${projects.length} projects)`);
