import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CASES_OUT = join(ROOT, "src", "data", "cases.generated.ts");
const PROJECTS_OUT = join(ROOT, "src", "data", "projects.generated.ts");
const PUBLIC_ROOT = join(ROOT, "public", "projects");

const SLUGS = [
  "elix",
  "burger-bliss-uae-by-grandiose-brand-identity-design",
  "cheese-board-by-grandiose",
  "dental-nation-acacia-clinic",
  "flaky-pastry-the-galleria",
  "the-knowledge-academy-training-centre",
  "mari-vanna-dubai",
  "the-observatory-lounge-the-prime-52",
  "tokyo-arabia",
  "yvonne-dubai-hills",
  "the-knowledge-academy",
  "flow-cafe",
  "aesthetic-academy",
  "mtn-bayobab",
  "uniq",
  "reif-kushiyaki",
  "hlk",
  "voco-monaco",
  "nama-yoso",
  "pitfire",
  "tero-the-experience-by-reif-othman",
];

const UA = { headers: { "User-Agent": "Twentyone06Importer/1.0" } };
const FACT_LABELS = ["client", "location", "date", "venue"];
const SKIP_TEXT = /^(our creation|client|location|date|venue|client review)$/i;

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const TARGETS = only.length ? only : SLUGS;

function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&#038;/g, "&")
    .replace(/&#x26;/gi, "&")
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/\\\//g, "/");
}

function decodeHtml(html) {
  return decodeEntities(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function preferred(url) {
  let u = decodeEntities(url).trim();
  u = u.replace(/^['"]+|['"]+$/g, "");
  u = u.split("?")[0].split("#")[0];
  u = u.replace(/-\d+x\d+(\.(jpe?g|png|webp|avif))$/i, "$1");
  u = u.replace(/-scaled(\.(jpe?g|png|webp|avif))$/i, "$1");
  return u;
}

function fileNameOf(url) {
  let name;
  try {
    name = decodeURIComponent(preferred(url).split("/").pop() || "image.jpg");
  } catch {
    name = preferred(url).split("/").pop() || "image.jpg";
  }
  return name.replace(/-rijsi[a-z0-9]+/i, "");
}

function skipImage(url, slug) {
  const u = preferred(url);
  const file = fileNameOf(u);
  if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) return true;
  if (/\/elementor\/thumbs\//i.test(u)) return true;
  if (/Philosophy-/i.test(file)) return true;
  if (/Svg-background/i.test(file)) return true;
  if (/^Group[-_]/i.test(file)) return true;
  if (/WEBSITE-END/i.test(file)) return true;
  if (/\.(woff2?|ttf|eot|otf|svg)(\?|$)/i.test(u)) return true;
  if (isForeignImage(file, slug)) return true;
  return false;
}

function isForeignImage(file, slug) {
  const f = file.toLowerCase();
  const stems = [
    ["elix", ["elixa-spa", "elix-spa"]],
    ["burger-bliss-uae-by-grandiose-brand-identity-design", ["burger-bliss"]],
    ["cheese-board-by-grandiose", ["cheese-board", "cheeseboard"]],
    ["dental-nation-acacia-clinic", ["dental-nation", "acacia-clinic"]],
    ["flaky-pastry-the-galleria", ["flaky-pastry"]],
    ["mari-vanna-dubai", ["mari-vanna"]],
    ["the-observatory-lounge-the-prime-52", ["observatory", "prime-52", "prime52"]],
    ["tokyo-arabia", ["tokyo-arabia"]],
    ["yvonne-dubai-hills", ["yvonne"]],
    ["flow-cafe", ["flow-cafe"]],
    ["aesthetic-academy", ["aesthetic-academy"]],
    ["mtn-bayobab", ["mtn-bayobab", "mtn-2"]],
    ["reif-kushiyaki", ["reif-kushiyaki"]],
    ["voco-monaco", ["voco-monaco"]],
    ["nama-yoso", ["nama-yoso", "yoso-"]],
    ["pitfire", ["pitfire"]],
    ["tero-the-experience-by-reif-othman", ["tero-"]],
    ["uniq", ["uniq-"]],
    ["hlk", ["hlk-"]],
  ];
  for (const [other, marks] of stems) {
    if (other === slug) continue;
    if (marks.some((m) => f.includes(m))) return true;
  }
  return false;
}

function splitTitleLines(title) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [title.trim()];
  if (words.length === 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function eyebrowForTitle(title) {
  const t = title.toLowerCase();
  if (/concept/.test(t)) return "Concept";
  if (/direction/.test(t)) return "Direction";
  if (/treatment|room|space/.test(t)) return "Spaces";
  if (/entrance|arrival/.test(t)) return "Arrival";
  if (/experience/.test(t)) return "Experience";
  if (/review/.test(t)) return "Client Review";
  if (/brand/.test(t)) return "Brand";
  if (/interior|design/.test(t)) return "Design";
  return "Chapter";
}

async function fetchJson(url) {
  const res = await fetch(url, UA);
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, UA);
  if (!res.ok) return "";
  return res.text();
}

function parseCss(css) {
  const bgById = {};
  const minH = {};
  for (const m of css.matchAll(
    /elementor-element-([a-z0-9]+)[^{]*\{[^}]*background-image:url\(["']?(https:\/\/twentyone06\.com\/wp-content\/uploads\/[^"')]+)["']?\)/gi,
  )) {
    bgById[m[1]] = preferred(m[2]);
  }
  for (const m of css.matchAll(
    /elementor-element-([a-z0-9]+)\{[^}]*--min-height:([^;]+);/gi,
  )) {
    minH[m[1]] = m[2].trim();
  }
  return { bgById, minH };
}

function extractNodes(html) {
  const nodes = [];
  for (const m of html.matchAll(/<(h[1-6]|p)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = decodeHtml(m[2]);
    if (text) nodes.push({ tag: m[1].toLowerCase(), text });
  }
  for (const m of html.matchAll(
    /<div class="elementor-element[^"]*elementor-widget-text-editor[^"]*"[\s\S]*?<div class="elementor-widget-container">\s*([\s\S]*?)\s*<\/div>/gi,
  )) {
    if (/<(h[1-6]|p)[\s>]/i.test(m[1])) continue;
    const text = decodeHtml(m[1]);
    if (text && text.length > 1) nodes.push({ tag: "div", text });
  }
  return nodes;
}

function collectImages(chunk, bgById, minH, slug) {
  const found = [];
  const seen = new Set();
  const minHFor = {};

  const add = (raw, minHeight) => {
    if (!raw) return;
    const url = preferred(raw);
    if (!url || skipImage(url, slug)) return;
    const key = fileNameOf(url).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    found.push(url);
    if (minHeight) minHFor[url] = minHeight;
  };

  const tokenRe =
    /elementor-element-([a-z0-9]+)|<img[^>]*\ssrc=["']([^"']+)["']|background-image:\s*url\((?:&(?:#039|quot|#34);|["'])?(https?:\/\/[^"'&)]+)/gi;
  let m;
  while ((m = tokenRe.exec(chunk))) {
    if (m[1] && bgById[m[1]]) add(bgById[m[1]], minH[m[1]]);
    else if (m[2]) add(m[2]);
    else if (m[3]) add(m[3]);
  }

  return { urls: found, minHFor };
}

function isPng(url) {
  return /\.png$/i.test(fileNameOf(url));
}

function isTall(minH) {
  return /100vh|91vh|90vh/i.test(minH || "");
}

function isLarge(minH) {
  return /100vh|91vh|90vh|80vh|70vh|60vh/i.test(minH || "");
}

function parseHero(chunk, wpTitle, terms) {
  const nodes = extractNodes(chunk);
  const facts = [];
  const used = new Set();

  for (let i = 0; i < nodes.length; i++) {
    const label = nodes[i].text.trim().toLowerCase();
    if (FACT_LABELS.includes(label) && nodes[i + 1]) {
      const pretty = label.charAt(0).toUpperCase() + label.slice(1);
      facts.push({ label: pretty, value: nodes[i + 1].text.replace(/\n/g, " ").trim() });
      used.add(i);
      used.add(i + 1);
      i++;
    }
  }

  const leftover = nodes.filter((_, i) => !used.has(i));
  const tagsNode = leftover.find(
    (n) =>
      n.text.length < 90 &&
      /branding|design|hospitality|f\s*&\s*b|retail|commercial|healthcare|workspace/i.test(
        n.text,
      ) &&
      !SKIP_TEXT.test(n.text),
  );
  const tags = (terms && terms.length
    ? terms.join(" · ")
    : tagsNode
      ? tagsNode.text
          .replace(/\s*[-–—]\s*/g, " · ")
          .replace(/\s{2,}/g, " · ")
          .trim()
      : "");

  const introNode = leftover.find(
    (n) =>
      n.text.length > 80 &&
      n !== tagsNode &&
      !SKIP_TEXT.test(n.text) &&
      n.text.toLowerCase() !== wpTitle.toLowerCase(),
  );
  const intro = introNode ? introNode.text.replace(/\n+/g, " ").trim() : "";

  const titleNode = leftover.find((n) => {
    if (n === tagsNode || n === introNode) return false;
    if (SKIP_TEXT.test(n.text)) return false;
    const t = n.text.trim();
    if (t.length < 2 || t.length > 80) return false;
    if (/^h[1-3]$/.test(n.tag)) return true;
    if (t.toUpperCase() === t && t.length < 60) return true;
    if (wpTitle.toLowerCase().includes(t.toLowerCase())) return true;
    return false;
  });
  const title = titleNode?.text.trim() || wpTitle;

  return { facts, tags, intro, title };
}

function parseReview(nodes, images) {
  const texts = nodes
    .map((n) => n.text.trim())
    .filter((t) => t && !/^client review$/i.test(t));
  const longest = [...texts].sort((a, b) => b.length - a.length)[0] || "";
  const longLines = longest.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  let quote = "";
  let name = "";
  let role;
  let org;
  if (longLines.length >= 2 && longLines[0].length > 50) {
    quote = longLines[0];
    name = longLines[1];
    role = longLines[2];
    org = longLines[3];
  } else {
    quote = texts.find((t) => t.length > 50) || longest;
    const rest = texts.filter((t) => t !== quote && t.length < 160);
    name = (rest[0] || "").split("\n")[0];
    const extra = (rest[1] || rest[0] || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (extra[0] && extra[0] !== name) role = extra[0];
    if (extra[1]) org = extra[1];
    if (!role && rest[1]) {
      const bits = rest[1].split("\n").map((s) => s.trim()).filter(Boolean);
      role = bits[0];
      org = bits[1];
    }
  }
  const looksRole = (s) =>
    /owner|chef|cheif|manager|director|founder|chief/i.test(s || "");
  const looksName = (s) =>
    /^[A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){1,3}$/.test((s || "").trim());
  if (looksRole(name) && looksName(role)) {
    const swapped = name;
    name = role;
    role = swapped;
  }
  const image = images.find((u) => /\.(jpe?g|webp|avif)$/i.test(u)) || images[0];
  return {
    type: "review",
    quote,
    name: (name || "").replace(/\n/g, " "),
    ...(role ? { role } : {}),
    ...(org ? { org } : {}),
    _imageUrl: image,
  };
}

function classifyChunk({ nodes, images, minHFor, parentMinH, slug }) {
  const blocks = [];
  const headings = nodes.filter(
    (n) => /^h[1-4]$/.test(n.tag) && !SKIP_TEXT.test(n.text) && n.text.length < 120,
  );
  const longParas = nodes
    .filter((n) => {
      if (SKIP_TEXT.test(n.text)) return false;
      if (headings.some((h) => h.text === n.text)) return false;
      return n.text.length > 70;
    })
    .map((n) => n.text.replace(/\n+/g, " ").trim());
  const uniqueParas = [...new Set(longParas)];
  const shortLabels = nodes
    .filter((n) => {
      if (SKIP_TEXT.test(n.text)) return false;
      if (headings[0] && n.text === headings[0].text) return false;
      if (n.text.length < 3 || n.text.length > 70) return false;
      if (uniqueParas.includes(n.text)) return false;
      if (/^our creation$/i.test(n.text)) return false;
      return true;
    })
    .map((n) => n.text.replace(/\n/g, " ").trim());
  const uniqueLabels = [...new Set(shortLabels)].filter(
    (t) => !uniqueParas.some((p) => p.startsWith(t.slice(0, 40))),
  );

  const isReview = nodes.some((n) => /client review/i.test(n.text));
  if (isReview) {
    const review = parseReview(nodes, images);
    if (review.quote && review.name) {
      blocks.push(review);
      return blocks;
    }
  }

  if (!images.length && !headings.length && !uniqueParas.length) return blocks;

  if (
    images.length &&
    images.every(isPng) &&
    !headings.length &&
    uniqueParas.length === 0
  ) {
    const largePng =
      images.length === 1 &&
      (isLarge(parentMinH) || isLarge(minHFor[images[0]]) || isTall(parentMinH));
    if (!largePng) {
      blocks.push({ type: "marks", srcs: images });
      return blocks;
    }
  }

  const title = headings[0]?.text.replace(/:$/, "").trim() || "";
  let mainImages = images;
  let labeled = [];

  if (uniqueLabels.length >= 2 && images.length >= uniqueLabels.length) {
    labeled = uniqueLabels.map((label, i) => ({
      src: images[images.length - uniqueLabels.length + i],
      label,
    }));
    mainImages = images.slice(0, images.length - uniqueLabels.length);
  }

  if (title) {
    const thumbs = mainImages.filter((u) => !isLarge(minHFor[u]));
    const large = mainImages.filter((u) => isLarge(minHFor[u]));
    let layout = "image-below";
    let used = mainImages;
    let leftover = [];

    if (thumbs.length >= 3) {
      layout = "thumbs-left";
      used = thumbs.slice(0, Math.min(thumbs.length, 6));
      leftover = [...thumbs.slice(used.length), ...large];
    } else if (large.length >= 1 && thumbs.length <= 1) {
      layout = "image-right";
      used = [...(thumbs[0] && large.length >= 1 ? [thumbs[0]] : []), ...large].slice(0, 2);
      leftover = mainImages.filter((u) => !used.includes(u));
    } else if (mainImages.length === 1) {
      layout = "image-right";
      used = mainImages;
    } else if (mainImages.length === 2 && (isLarge(parentMinH) || large.length)) {
      layout = "image-right";
      used = mainImages;
    } else {
      layout = mainImages.length ? "image-below" : "image-below";
      used = mainImages;
    }

    blocks.push({
      type: "copy",
      eyebrow: eyebrowForTitle(title),
      title: splitTitleLines(title),
      paragraphs: uniqueParas,
      ...(used.length ? { images: used, layout } : {}),
    });

    if (leftover.length === 1) {
      blocks.push({ type: "fullBleed", src: leftover[0], tall: isTall(minHFor[leftover[0]]) });
    } else if (leftover.length > 1) {
      blocks.push({
        type: "gallery",
        srcs: leftover,
        columns: leftover.length % 3 === 0 ? 3 : 2,
      });
    }
  } else if (images.length === 1) {
    blocks.push({
      type: "fullBleed",
      src: images[0],
      tall: isTall(parentMinH) || isTall(minHFor[images[0]]),
    });
  } else if (images.length > 1) {
    if (uniqueLabels.length >= 2 && labeled.length) {
      // already handled below
    } else {
      blocks.push({
        type: "gallery",
        srcs: images,
        columns: images.length % 3 === 0 ? 3 : 2,
      });
    }
    if (uniqueParas[0] && uniqueParas[0].length < 400) {
      blocks.push({ type: "caption", text: uniqueParas[0] });
    }
  } else if (uniqueParas.length) {
    blocks.push({ type: "caption", text: uniqueParas[0] });
  }

  if (labeled.length) {
    blocks.push({ type: "labeled", items: labeled });
  }

  return blocks;
}

async function downloadOne(url, dest) {
  if (existsSync(dest)) return "skip";
  const clean = preferred(url);
  const scaled = clean.replace(/(\.(jpe?g|png|webp|avif))$/i, "-scaled$1");
  const candidates = [...new Set([url.split("?")[0], clean, scaled])];
  mkdirSync(dirname(dest), { recursive: true });
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, UA);
      if (!res.ok || !res.body) continue;
      await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
      return "ok";
    } catch {
      // try next
    }
  }
  return "fail";
}

async function mapPool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) || 1 }, () => worker()));
  return out;
}

function localPath(slug, url) {
  return `/projects/${slug}/${fileNameOf(url)}`;
}

function rewriteBlocks(blocks, slug, urlToLocal) {
  const mapSrc = (url) => urlToLocal.get(url) || localPath(slug, url);
  return blocks.map((b) => {
    if (b.type === "fullBleed") return { ...b, src: mapSrc(b.src) };
    if (b.type === "marks") return { ...b, srcs: b.srcs.map(mapSrc) };
    if (b.type === "copy") {
      return {
        type: "copy",
        eyebrow: b.eyebrow,
        title: b.title,
        paragraphs: b.paragraphs,
        ...(b.images ? { images: b.images.map(mapSrc), layout: b.layout } : {}),
      };
    }
    if (b.type === "gallery") return { ...b, srcs: b.srcs.map(mapSrc) };
    if (b.type === "labeled") {
      return { type: "labeled", items: b.items.map((it) => ({ src: mapSrc(it.src), label: it.label })) };
    }
    if (b.type === "review") {
      const { _imageUrl, image, ...rest } = b;
      const src = _imageUrl ? mapSrc(_imageUrl) : image;
      return { ...rest, ...(src ? { image: src } : {}) };
    }
    return b;
  });
}

function normalizeBlocks(blocks) {
  const out = [];
  let sawBleed = false;
  for (const b of blocks) {
    if (b.type === "fullBleed") {
      const next = { ...b, tall: sawBleed ? Boolean(b.tall) : true };
      const prev = out[out.length - 1];
      if (prev?.type === "fullBleed" && prev.src === next.src) continue;
      sawBleed = true;
      out.push(next);
      continue;
    }
    if (b.type === "copy") {
      if (!b.paragraphs.length && !(b.images && b.images.length) && !b.title?.length) continue;
    }
    if (b.type === "gallery" && (!b.srcs || b.srcs.length === 0)) continue;
    if (b.type === "marks" && (!b.srcs || b.srcs.length === 0)) continue;
    if (b.type === "review" && !b.quote) continue;
    out.push(b);
  }
  return out;
}

function collectUrlsFromBlocks(blocks) {
  const urls = [];
  for (const b of blocks) {
    if (b.type === "fullBleed") urls.push(b.src);
    if (b.type === "marks") urls.push(...b.srcs);
    if (b.type === "copy" && b.images) urls.push(...b.images);
    if (b.type === "gallery") urls.push(...b.srcs);
    if (b.type === "labeled") urls.push(...b.items.map((i) => i.src));
    if (b.type === "review" && b._imageUrl) urls.push(b._imageUrl);
  }
  return [...new Set(urls)];
}

async function scrapeSlug(slug) {
  process.stdout.write(`\n▶ ${slug}\n`);
  const items = await fetchJson(
    `https://twentyone06.com/wp-json/wp/v2/project?slug=${slug}&_embed=1`,
  );
  const p = items[0];
  if (!p) throw new Error("not found");
  const css = await fetchText(
    `https://twentyone06.com/wp-content/uploads/elementor/css/post-${p.id}.css`,
  );
  const { bgById, minH } = parseCss(css);
  const html = p.content.rendered;
  const cut = html.search(/Related projects|loop-carousel/i);
  const body = cut > 0 ? html.slice(0, cut) : html;
  const wpTitle = decodeHtml(p.title.rendered);
  const terms = (p._embedded?.["wp:term"] ?? [])
    .flat()
    .filter((t) => t.taxonomy === "project_category")
    .map((t) => decodeHtml(t.name));

  const parentStarts = [
    ...body.matchAll(
      /<div class="elementor-element elementor-element-([a-z0-9]+)[^"]*e-parent[^"]*"/gi,
    ),
  ];

  let hero = {
    facts: [],
    tags: terms.join(" · "),
    intro: "",
    title: wpTitle,
  };
  const rawBlocks = [];

  for (let i = 0; i < parentStarts.length; i++) {
    const start = parentStarts[i].index;
    const end = i + 1 < parentStarts.length ? parentStarts[i + 1].index : body.length;
    const chunk = body.slice(start, end);
    const id = parentStarts[i][1];
    const nodes = extractNodes(chunk);
    const { urls, minHFor } = collectImages(chunk, bgById, minH, slug);
    for (const u of urls) {
      if (!minHFor[u] && minH[id]) minHFor[u] = minH[id];
    }

    if (i === 0) {
      hero = parseHero(chunk, wpTitle, terms);
      continue;
    }

    if (/video-container|elementor-widget-video/.test(chunk) && urls.length === 0) {
      continue;
    }

    const classified = classifyChunk({
      nodes,
      images: urls,
      minHFor,
      parentMinH: minH[id] || "",
      slug,
    });
    rawBlocks.push(...classified);
  }

  const blocks = normalizeBlocks(rawBlocks);
  const remoteUrls = collectUrlsFromBlocks(blocks);
  const destDir = join(PUBLIC_ROOT, slug);
  mkdirSync(destDir, { recursive: true });

  const urlToLocal = new Map();
  const dlStats = { ok: 0, skip: 0, fail: 0 };
  await mapPool(remoteUrls, 4, async (url) => {
    const dest = join(destDir, fileNameOf(url));
    const status = await downloadOne(url, dest);
    dlStats[status] += 1;
    if (status === "fail") {
      console.warn("  fail", fileNameOf(url));
    } else {
      urlToLocal.set(url, localPath(slug, url));
    }
  });

  const study = {
    slug,
    eyebrow: "Our Creation",
    tags: hero.tags,
    title: hero.title,
    titleLines: splitTitleLines(hero.title),
    intro: hero.intro,
    facts: hero.facts,
    blocks: rewriteBlocks(blocks, slug, urlToLocal),
  };

  const imgCount = readdirSync(destDir).filter((f) =>
    /\.(jpe?g|png|webp|avif)$/i.test(f),
  ).length;
  console.log(
    `  id ${p.id}  blocks ${study.blocks.length}  facts ${study.facts.length}  images ${imgCount}  dl ${dlStats.ok} ok / ${dlStats.skip} skip / ${dlStats.fail} fail`,
  );
  return { study, dlStats, imgCount, facts: hero.facts };
}

function emitCasesTs(cases) {
  const lines = [];
  lines.push(`import type { ProjectCaseStudy } from "./project-case";`);
  lines.push("");
  lines.push(`export const projectCases: Record<string, ProjectCaseStudy> = {`);
  for (const [slug, study] of Object.entries(cases)) {
    const json = JSON.stringify(study, null, 2)
      .split("\n")
      .map((l, i) => (i === 0 ? l : `  ${l}`))
      .join("\n");
    lines.push(`  ${JSON.stringify(slug)}: ${json},`);
  }
  lines.push(`};`);
  lines.push("");
  lines.push(`export function getProjectCase(slug: string): ProjectCaseStudy | undefined {`);
  lines.push(`  return projectCases[slug];`);
  lines.push(`}`);
  lines.push("");
  return lines.join("\n");
}

function patchProjectsGenerated(factsBySlug) {
  if (!existsSync(PROJECTS_OUT)) {
    console.warn("projects.generated.ts missing, skip patch");
    return;
  }
  let src = readFileSync(PROJECTS_OUT, "utf8");
  for (const [slug, facts] of Object.entries(factsBySlug)) {
    const map = Object.fromEntries(facts.map((f) => [f.label.toLowerCase(), f.value]));
    const client = map.client;
    const location = map.location;
    const date = map.date;
    const venue = map.venue;
    const year = date?.match(/(?:19|20)\d{2}/)?.[0];
    const re = new RegExp(
      `(\\{\\s*slug: ${JSON.stringify(slug)},[\\s\\S]*?)(\\n  \\},)`,
    );
    src = src.replace(re, (_, block, tail) => {
      let b = block;
      const set = (key, value) => {
        if (!value) return;
        const field = new RegExp(`${key}: "[^"]*"`);
        if (field.test(b)) b = b.replace(field, `${key}: ${JSON.stringify(value)}`);
      };
      set("client", client);
      set("location", location);
      set("year", year);
      set("duration", date);
      set("area", venue);
      return b + tail;
    });
  }
  writeFileSync(PROJECTS_OUT, src);
  console.log("patched", PROJECTS_OUT);
}

async function main() {
  mkdirSync(PUBLIC_ROOT, { recursive: true });
  let cases = {};
  if (existsSync(CASES_OUT) && only.length) {
    try {
      const mod = await import(`file:///${CASES_OUT.replace(/\\/g, "/")}?t=${Date.now()}`);
      cases = { ...(mod.projectCases || {}) };
    } catch {
      cases = {};
    }
  }

  const factsBySlug = {};
  const summary = [];
  const failures = [];

  for (const slug of TARGETS) {
    try {
      const { study, dlStats, imgCount, facts } = await scrapeSlug(slug);
      cases[slug] = study;
      factsBySlug[slug] = facts;
      summary.push({ slug, imgCount, blocks: study.blocks.length, dlStats, ok: true });
    } catch (err) {
      console.error(`  ERROR ${slug}:`, err.message || err);
      failures.push({ slug, error: String(err.message || err) });
      summary.push({ slug, ok: false, error: String(err.message || err) });
    }
  }

  // Stable key order: SLUGS first, then any extras
  const ordered = {};
  for (const slug of SLUGS) {
    if (cases[slug]) ordered[slug] = cases[slug];
  }
  for (const slug of Object.keys(cases)) {
    if (!ordered[slug]) ordered[slug] = cases[slug];
  }

  writeFileSync(CASES_OUT, emitCasesTs(ordered));
  console.log("\nwrote", CASES_OUT, Object.keys(ordered).length, "cases");
  patchProjectsGenerated(factsBySlug);

  console.log("\n=== summary ===");
  for (const row of summary) {
    if (row.ok) {
      console.log(
        `${row.slug}: ${row.imgCount} images, ${row.blocks} blocks`,
      );
    } else {
      console.log(`${row.slug}: FAIL ${row.error}`);
    }
  }
  if (failures.length) {
    console.log("\nfailures", failures);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
