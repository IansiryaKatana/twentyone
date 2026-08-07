import {
  faqPage,
  getPost,
  getProject,
  getService,
  getServiceCategories,
  journalPosts,
  newHome,
  projects,
  teamMembers as staticTeamMembers,
  awards as staticAwards,
  whyUsItems as staticWhyUs,
  type Award,
  type JournalPost,
  type Project,
  type ServiceCategory,
  type TeamMember,
  type WhyUsItem,
} from "@/data/content";
import { getSupabase } from "@/integrations/supabase/client";
import {
  mapFaqSections,
  mapJournalPost,
  mapProject,
  mapService,
  mapTestimonial,
  type FaqCategory,
  type Testimonial,
} from "@/lib/cms/mappers";
import type { CmsSnapshot } from "@/lib/cms/types";
import type { Json } from "@/integrations/supabase/database.types";

export type CmsMode = "static" | "live";

function useLive(snapshot: CmsSnapshot | null, mode: CmsMode): boolean {
  return mode === "live" && snapshot !== null;
}

export function getProjectsList(snapshot: CmsSnapshot | null, mode: CmsMode): Project[] {
  if (useLive(snapshot, mode) && snapshot!.projects.length > 0) {
    return snapshot!.projects;
  }
  return projects;
}

export function getProjectBySlug(
  slug: string,
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): Project | undefined {
  if (useLive(snapshot, mode)) {
    const fromSnapshot = snapshot!.projectsBySlug[slug];
    if (fromSnapshot) return fromSnapshot;
  }
  return getProject(slug);
}

export function getRelatedProjectsList(
  slug: string,
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
  limit = 3,
): Project[] {
  const list = getProjectsList(snapshot, mode);
  return list.filter((p) => p.slug !== slug).slice(0, limit);
}

export function getJournalList(snapshot: CmsSnapshot | null, mode: CmsMode): JournalPost[] {
  if (useLive(snapshot, mode) && snapshot!.journalPosts.length > 0) {
    return snapshot!.journalPosts;
  }
  return journalPosts;
}

export function getJournalBySlug(
  slug: string,
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): JournalPost | undefined {
  if (useLive(snapshot, mode)) {
    const fromSnapshot = snapshot!.journalBySlug[slug];
    if (fromSnapshot) return fromSnapshot;
  }
  return getPost(slug);
}

export function getFaqCategories(snapshot: CmsSnapshot | null, mode: CmsMode): FaqCategory[] {
  if (useLive(snapshot, mode) && snapshot!.faqCategories.length > 0) {
    return snapshot!.faqCategories;
  }
  return faqPage.categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    items: cat.items,
  }));
}

export function getServicesList(
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): ServiceCategory[] {
  if (useLive(snapshot, mode) && snapshot!.services.length > 0) {
    return snapshot!.services;
  }
  return getServiceCategories();
}

export function getServiceBySlug(
  slug: string,
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): ServiceCategory | undefined {
  if (useLive(snapshot, mode)) {
    const fromSnapshot = snapshot!.servicesBySlug[slug];
    if (fromSnapshot) return fromSnapshot;
  }
  return getService(slug);
}

export function getTestimonialsList(
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): Testimonial[] {
  if (useLive(snapshot, mode) && snapshot!.testimonials.length > 0) {
    return snapshot!.testimonials;
  }
  return newHome.testimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    role: t.role,
    image: t.image,
  }));
}

export function getTeamMembersList(
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): TeamMember[] {
  if (useLive(snapshot, mode) && snapshot!.teamMembers.length > 0) {
    return snapshot!.teamMembers;
  }
  return staticTeamMembers;
}

export function getAwardsList(
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): Award[] {
  if (useLive(snapshot, mode) && snapshot!.awards.length > 0) {
    return snapshot!.awards;
  }
  return staticAwards;
}

export function getWhyUsList(
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): WhyUsItem[] {
  if (useLive(snapshot, mode) && snapshot!.whyUs.length > 0) {
    return snapshot!.whyUs;
  }
  return staticWhyUs;
}

export function getNewHomeBlocks(
  snapshot: CmsSnapshot | null,
  mode: CmsMode,
): typeof newHome {
  if (useLive(snapshot, mode) && snapshot!.newHome) {
    return snapshot!.newHome;
  }
  return newHome;
}

export function getFaqSchemaFromCategories(categories: FaqCategory[]) {
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    })),
  );
}

/** Loader-friendly fetch without React context. Falls back to static content. */
export async function fetchProjectBySlug(slug: string): Promise<Project | undefined> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return mapProject(data);
  }
  return getProject(slug);
}

export async function fetchJournalBySlug(slug: string): Promise<JournalPost | undefined> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb
      .from("journal_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return mapJournalPost(data);
  }
  return getPost(slug);
}

export async function fetchFaqCategories(): Promise<FaqCategory[]> {
  const sb = getSupabase();
  if (!sb) {
    return faqPage.categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      items: cat.items,
    }));
  }

  const [topicsRes, entriesRes] = await Promise.all([
    sb.from("faq_topics").select("*").eq("published", true).order("sort_order"),
    sb.from("faq_entries").select("*").eq("published", true).order("sort_order"),
  ]);

  if (topicsRes.data?.length) {
    return mapFaqSections(topicsRes.data, entriesRes.data ?? []);
  }

  return faqPage.categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    items: cat.items,
  }));
}

export async function fetchProjectsList(): Promise<Project[]> {
  const sb = getSupabase();
  if (!sb) return projects;
  const { data } = await sb
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (data?.length) return data.map(mapProject);
  return projects;
}

export async function fetchJournalList(): Promise<JournalPost[]> {
  const sb = getSupabase();
  if (!sb) return journalPosts;
  const { data } = await sb
    .from("journal_posts")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (data?.length) return data.map(mapJournalPost);
  return journalPosts;
}

export type SubmitFormResult = { ok: true } | { ok: false; error: string };

export async function submitFormSubmission(
  formName: string,
  payload: Record<string, unknown>,
): Promise<SubmitFormResult> {
  const sb = getSupabase();
  if (!sb) {
    return { ok: false, error: "Form submission is unavailable." };
  }

  const { error } = await sb.from("form_submissions").insert({
    form_name: formName,
    payload: payload as Json,
    status: "new",
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .eq("status", "approved")
    .order("sort_order", { ascending: true });
  return (data ?? []).map(mapTestimonial);
}

export async function fetchServicesList(): Promise<ServiceCategory[]> {
  const sb = getSupabase();
  if (!sb) return getServiceCategories();
  const [servicesRes, capsRes] = await Promise.all([
    sb.from("services").select("*").eq("published", true).order("sort_order"),
    sb.from("service_capabilities").select("*").eq("published", true).order("sort_order"),
  ]);
  if (!servicesRes.data?.length) return getServiceCategories();
  const capsByService = new Map<string, NonNullable<typeof capsRes.data>>();
  for (const cap of capsRes.data ?? []) {
    const list = capsByService.get(cap.service_id) ?? [];
    list.push(cap);
    capsByService.set(cap.service_id, list);
  }
  return servicesRes.data.map((row) => mapService(row, capsByService.get(row.id) ?? []));
}
