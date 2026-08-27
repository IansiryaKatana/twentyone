import { getSupabase } from "@/integrations/supabase/client";

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function emptyPageSeo(): PageSeo {
  return { title: "", description: "", keywords: [] };
}

export function parsePageSeo(value: unknown, fallback: PageSeo): PageSeo {
  const r = asRecord(value);
  const title = typeof r.title === "string" ? r.title.trim() : "";
  const description = typeof r.description === "string" ? r.description.trim() : "";
  const keywords = Array.isArray(r.keywords)
    ? r.keywords.filter((k): k is string => typeof k === "string" && k.trim().length > 0)
    : typeof r.keywords === "string"
      ? r.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

  return {
    title: title || fallback.title,
    description: description || fallback.description,
    keywords: keywords.length > 0 ? keywords : fallback.keywords,
  };
}

export function seoFromMarketingContent(
  content: unknown,
  fallback: PageSeo,
): PageSeo {
  return parsePageSeo(asRecord(content).seo, fallback);
}

export function seoFromMarketingPages(
  pages: Record<string, unknown>,
  slugs: string[],
  fallback: PageSeo,
): PageSeo {
  for (const slug of slugs) {
    if (pages[slug] != null) {
      return seoFromMarketingContent(pages[slug], fallback);
    }
  }
  return fallback;
}

export function pageSeoHead(seo: PageSeo) {
  const keywords = seo.keywords.join(", ");
  return {
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      ...(keywords ? [{ name: "keywords" as const, content: keywords }] : []),
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
    ],
  };
}

/** Public loader helper. Falls back to the live page SEO in content.ts. */
export async function fetchMarketingSeo(
  slug: string | string[],
  fallback: PageSeo,
): Promise<PageSeo> {
  const slugs = Array.isArray(slug) ? slug : [slug];
  const sb = getSupabase();
  if (!sb) return fallback;

  const { data } = await sb
    .from("marketing_pages")
    .select("slug, content")
    .in("slug", slugs)
    .eq("published", true);

  if (!data?.length) return fallback;

  for (const wanted of slugs) {
    const row = data.find((item) => item.slug === wanted);
    if (row) return seoFromMarketingContent(row.content, fallback);
  }

  return fallback;
}
