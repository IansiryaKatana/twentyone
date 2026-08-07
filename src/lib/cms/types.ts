import type { Award, JournalPost, Project, TeamMember, WhyUsItem } from "@/data/content";
import type { newHome } from "@/data/content";
import type { FaqCategory, Testimonial } from "@/lib/cms/mappers";
import type { ServiceCategory } from "@/data/content";

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

export function buildNewHomeBlocks(
  marketingPages: Record<string, unknown>,
  siteSettings: Record<string, unknown>,
): NewHomeBlocks | null {
  const pageContent = marketingPages["new-home"];
  if (pageContent && typeof pageContent === "object" && pageContent !== null) {
    return pageContent as NewHomeBlocks;
  }

  const settingsContent = siteSettings["new_home"];
  if (settingsContent && typeof settingsContent === "object" && settingsContent !== null) {
    return settingsContent as NewHomeBlocks;
  }

  const legacyKey = siteSettings["new-home"];
  if (legacyKey && typeof legacyKey === "object" && legacyKey !== null) {
    return legacyKey as NewHomeBlocks;
  }

  return null;
}
