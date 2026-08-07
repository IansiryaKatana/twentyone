import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/database.types";
import {
  mapAward,
  mapFaqSections,
  mapJournalPost,
  mapProject,
  mapService,
  mapTeamMember,
  mapTestimonial,
  mapWhyUs,
} from "@/lib/cms/mappers";
import {
  buildNewHomeBlocks,
  emptyCmsSnapshot,
  indexBySlug,
  type CmsSnapshot,
} from "@/lib/cms/types";

export async function loadCmsSnapshot(
  sb: SupabaseClient<Database>,
): Promise<CmsSnapshot> {
  const [
    projectsRes,
    journalRes,
    faqTopicsRes,
    faqEntriesRes,
    servicesRes,
    capabilitiesRes,
    testimonialsRes,
    teamMembersRes,
    awardsRes,
    whyUsRes,
    marketingPagesRes,
    siteSettingsRes,
  ] = await Promise.all([
    sb
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("journal_posts")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("faq_topics")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("faq_entries")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("service_capabilities")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("awards")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("why_us")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    sb
      .from("marketing_pages")
      .select("*")
      .eq("published", true),
    sb.from("site_settings").select("*"),
  ]);

  const errors = [
    projectsRes.error,
    journalRes.error,
    faqTopicsRes.error,
    faqEntriesRes.error,
    servicesRes.error,
    capabilitiesRes.error,
    testimonialsRes.error,
    teamMembersRes.error,
    awardsRes.error,
    whyUsRes.error,
    marketingPagesRes.error,
    siteSettingsRes.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("[loadCmsSnapshot] query errors:", errors);
    throw new Error(
      errors.map((e) => e?.message).filter(Boolean).join("; ") ||
        "Failed to load CMS snapshot",
    );
  }

  const projectRows = projectsRes.data ?? [];
  const journalRows = journalRes.data ?? [];
  const faqTopicRows = faqTopicsRes.data ?? [];
  const faqEntryRows = faqEntriesRes.data ?? [];
  const serviceRows = servicesRes.data ?? [];
  const capabilityRows = capabilitiesRes.data ?? [];
  const testimonialRows = testimonialsRes.data ?? [];
  const teamMemberRows = teamMembersRes.data ?? [];
  const awardRows = awardsRes.data ?? [];
  const whyUsRows = whyUsRes.data ?? [];
  const marketingPageRows = marketingPagesRes.data ?? [];
  const siteSettingRows = siteSettingsRes.data ?? [];

  const capabilitiesByService = new Map<string, typeof capabilityRows>();
  for (const cap of capabilityRows) {
    const list = capabilitiesByService.get(cap.service_id) ?? [];
    list.push(cap);
    capabilitiesByService.set(cap.service_id, list);
  }

  const projects = projectRows.map(mapProject);
  const journalPosts = journalRows.map(mapJournalPost);
  const faqCategories = mapFaqSections(faqTopicRows, faqEntryRows);
  const services = serviceRows.map((row) =>
    mapService(row, capabilitiesByService.get(row.id) ?? []),
  );
  const testimonials = testimonialRows.map(mapTestimonial);
  const teamMembers = teamMemberRows.map(mapTeamMember);
  const awards = awardRows.map(mapAward);
  const whyUs = whyUsRows.map(mapWhyUs);

  const marketingPages: Record<string, unknown> = {};
  for (const page of marketingPageRows) {
    marketingPages[page.slug] = page.content;
  }

  const siteSettings: Record<string, unknown> = {};
  for (const setting of siteSettingRows) {
    siteSettings[setting.key] = setting.value;
  }

  const newHome = buildNewHomeBlocks(marketingPages, siteSettings);

  const snapshot: CmsSnapshot = {
    projects,
    projectsBySlug: indexBySlug(projects),
    journalPosts,
    journalBySlug: indexBySlug(journalPosts),
    faqCategories,
    services,
    servicesBySlug: indexBySlug(services),
    testimonials,
    teamMembers,
    awards,
    whyUs,
    marketingPages,
    siteSettings,
    newHome,
  };

  return snapshot;
}

export function isCmsSnapshotEmpty(snapshot: CmsSnapshot): boolean {
  return (
    snapshot.projects.length === 0 &&
    snapshot.journalPosts.length === 0 &&
    snapshot.services.length === 0
  );
}

export { emptyCmsSnapshot };
