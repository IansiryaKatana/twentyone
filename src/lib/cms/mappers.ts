import type { Award, AwardStatus, FaqItem, JournalPost, Project, ServiceCategory, TeamMember, WhyUsItem } from "@/data/content";
import type { newHome } from "@/data/content";
import type { Tables } from "@/integrations/supabase/database.types";

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export type Testimonial = (typeof newHome.testimonials)[number];
export type { TeamMember, Award, AwardStatus, WhyUsItem };

type ProjectRow = Tables<"projects">;
type JournalRow = Tables<"journal_posts">;
type FaqTopicRow = Tables<"faq_topics">;
type FaqEntryRow = Tables<"faq_entries">;
type ServiceRow = Tables<"services">;
type CapabilityRow = Tables<"service_capabilities">;
type TestimonialRow = Tables<"testimonials">;
type TeamMemberRow = Tables<"team_members">;
type AwardRow = Tables<"awards">;
type WhyUsRow = Tables<"why_us">;

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asCredits(
  value: unknown,
): { role: string; name: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is { role: string; name: string } =>
        typeof item === "object" &&
        item !== null &&
        "role" in item &&
        "name" in item &&
        typeof (item as { role: unknown }).role === "string" &&
        typeof (item as { name: unknown }).name === "string",
    )
    .map((item) => ({ role: item.role, name: item.name }));
}

function asProjectCategory(
  value: string,
): Project["category"] {
  if (value === "Residential" || value === "Hospitality" || value === "Commercial") {
    return value;
  }
  return "Residential";
}

function asProjectSpan(value: string): Project["span"] {
  if (value === "tall" || value === "short" || value === "wide") {
    return value;
  }
  return "short";
}

const SERVICE_SLUGS: Project["services"][number][] = [
  "interior-design",
  "branding",
  "design-management",
  "design-strategy",
];

function asProjectServices(value: unknown): Project["services"] {
  const allowed = new Set<string>(SERVICE_SLUGS);
  const fromJson = asStringArray(value).filter((slug): slug is Project["services"][number] =>
    allowed.has(slug),
  );
  if (fromJson.length > 0) return fromJson;
  return ["interior-design"];
}

function asFaqLinkTo(value: string | null): "/services" | "/projects" | undefined {
  if (value === "/services" || value === "/projects") return value;
  return undefined;
}

function asBullets(value: unknown): string[] {
  return asStringArray(value);
}

export function mapProject(row: ProjectRow): Project {
  const category = asProjectCategory(row.category);
  return {
    slug: row.slug,
    title: row.title,
    location: row.location,
    price: row.price,
    category,
    services: asProjectServices(row.services),
    year: row.year,
    client: row.client,
    area: row.area,
    status: row.status,
    duration: row.duration,
    typologies: asStringArray(row.typologies),
    scope: asStringArray(row.scope),
    materials: asStringArray(row.materials),
    finishes: asStringArray(row.finishes),
    credits: asCredits(row.credits),
    challenge: row.challenge,
    approach: row.approach,
    outcome: row.outcome,
    excerpt: row.excerpt,
    body: asStringArray(row.body),
    hero: row.hero,
    gallery: asStringArray(row.gallery),
    span: asProjectSpan(row.span),
  };
}

export function mapJournalPost(row: JournalRow): JournalPost {
  const bodyFromJson = asStringArray(row.body);
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    tag: row.tag,
    image: row.image,
    body: bodyFromJson,
    featured: row.featured || undefined,
  };
}

export function mapFaqSections(
  topics: FaqTopicRow[],
  entries: FaqEntryRow[],
): FaqCategory[] {
  const entriesByTopic = new Map<string, FaqEntryRow[]>();
  for (const entry of entries) {
    const list = entriesByTopic.get(entry.topic_id) ?? [];
    list.push(entry);
    entriesByTopic.set(entry.topic_id, list);
  }

  return topics.map((topic) => {
    const topicEntries = (entriesByTopic.get(topic.id) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order,
    );

    const items: FaqItem[] = topicEntries.map((entry) => {
      const linkTo = asFaqLinkTo(entry.link_to);
      const item: FaqItem = {
        q: entry.question,
        a: entry.answer,
      };
      if (entry.link_label && linkTo) {
        item.link = { label: entry.link_label, to: linkTo };
      }
      return item;
    });

    return {
      id: topic.slug,
      label: topic.label,
      items,
    };
  });
}

export function mapService(
  row: ServiceRow,
  capabilities: CapabilityRow[],
): ServiceCategory {
  const sortedCaps = [...capabilities].sort((a, b) => a.sort_order - b.sort_order);

  return {
    id: row.slug,
    slug: row.slug,
    label: row.label,
    intro: row.intro || row.detail || row.description,
    heroImage: row.hero_image || row.image,
    indexLabel: row.index_label ?? "",
    title: row.title || row.label,
    description: row.description,
    detail: row.detail,
    bullets: asBullets(row.bullets),
    cta: row.cta,
    image: row.image || row.hero_image,
    items: sortedCaps.map((cap) => ({
      index: cap.index_label,
      title: cap.title,
      description: cap.description,
      image: cap.image,
    })),
  };
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    quote: row.quote,
    name: row.name,
    role: row.role,
    image: row.image,
  };
}

export function mapTeamMember(row: TeamMemberRow): TeamMember {
  return {
    name: row.name,
    title: row.title,
    image: row.image,
    linkedin: row.linkedin,
    ...(row.instagram.trim() ? { instagram: row.instagram } : {}),
  };
}

const AWARD_STATUSES: AwardStatus[] = [
  "winner",
  "highly_commended",
  "shortlisted",
  "editorial",
];

function asAwardStatus(value: string): AwardStatus {
  return AWARD_STATUSES.includes(value as AwardStatus)
    ? (value as AwardStatus)
    : "winner";
}

export function mapAward(row: AwardRow): Award {
  return {
    status: asAwardStatus(row.status),
    title: row.title,
  };
}

export function mapWhyUs(row: WhyUsRow): WhyUsItem {
  return {
    title: row.title,
    body: row.body,
  };
}

export function mapBulletsFromService(row: ServiceRow): string[] {
  return asBullets(row.bullets);
}
