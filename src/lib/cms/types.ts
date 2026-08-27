import type { Award, JournalPost, Project, TeamMember, WhyUsItem } from "@/data/content";
import { newHome } from "@/data/content";
import type { FaqCategory, Testimonial } from "@/lib/cms/mappers";
import type { ServiceCategory } from "@/data/content";
import { parsePageSeo } from "@/lib/cms/pageSeo";

export type NewHomeBlocks = typeof newHome;

export type CmsSnapshot = {
  projects: Project[];
  projectsBySlug: Record<string, Project>;
  journalPosts: JournalPost[];
  journalBySlug: Record<string, JournalPost>;
  faqCategories: FaqCategory[];
  services: ServiceCategory[];
  servicesBySlug: Record<string, ServiceCategory>;
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  awards: Award[];
  whyUs: WhyUsItem[];
  marketingPages: Record<string, unknown>;
  siteSettings: Record<string, unknown>;
  newHome: NewHomeBlocks | null;
};

export function emptyCmsSnapshot(): CmsSnapshot {
  return {
    projects: [],
    projectsBySlug: {},
    journalPosts: [],
    journalBySlug: {},
    faqCategories: [],
    services: [],
    servicesBySlug: {},
    testimonials: [],
    teamMembers: [],
    awards: [],
    whyUs: [],
    marketingPages: {},
    siteSettings: {},
    newHome: null,
  };
}

export function indexBySlug<T extends { slug: string }>(
  items: T[],
): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.slug, item]));
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

/**
 * Homepage section copy stays on the live site (`content.ts`).
 * Marketing may overlay SEO only, and we still accept the legacy `new-home` slug.
 */
export function buildNewHomeBlocks(
  marketingPages: Record<string, unknown>,
  siteSettings: Record<string, unknown>,
): NewHomeBlocks | null {
  const pageContent =
    marketingPages.home ??
    marketingPages["new-home"] ??
    siteSettings.new_home ??
    siteSettings["new-home"];

  if (!pageContent || typeof pageContent !== "object") {
    return null;
  }

  const seo = parsePageSeo(asRecord(pageContent).seo, newHome.seo);
  return { ...newHome, seo };
}
