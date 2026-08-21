import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "public", "projects", "elix");

const FILES = [
  "elixa-spa-images01.jpg",
  "elixa-spa-images02.png",
  "elixa-spa-images03.png",
  "elixa-spa-images04.jpg",
  "elixa-spa-images05.jpg",
  "elixa-spa-images06.jpg",
  "elixa-spa-images07.jpg",
  "elixa-spa-images08.jpg",
  "elixa-spa-images09.jpg",
  "elixa-spa-images11.jpg",
  "elixa-spa-images12.jpg",
  "elixa-spa-images13.jpg",
  "elixa-spa-images14.jpg",
  "elixa-spa-images15.jpg",
  "elixa-spa-images16.jpg",
  "elixa-spa-images17-scaled.jpg",
  "elixa-spa-images18-scaled.jpg",
  "elixa-spa-images19.jpg",
  "elixa-spa-images20.jpg",
  "elixa-spa-images21.jpg",
  "elixa-spa-images22.jpg",
];

async function download(name) {
  const url = `https://twentyone06.com/wp-content/uploads/2025/01/${name}`;
  const dest = join(DEST, name.replace("-scaled", ""));
  if (existsSync(dest)) {
    console.log("skip", name);
    return;
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "Twentyone06Importer/1.0" },
  });
  if (!res.ok || !res.body) {
    throw new Error(`${url} → ${res.status}`);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  console.log("ok", name);
}

mkdirSync(DEST, { recursive: true });
for (const name of FILES) {
  await download(name);
}
console.log("done", DEST);
