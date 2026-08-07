import { useMemo } from "react";
import { useCms } from "@/contexts/CmsContext";
import {
  getFaqCategories,
  getFaqSchemaFromCategories,
  getJournalBySlug,
  getJournalList,
  getProjectBySlug,
  getProjectsList,
  getRelatedProjectsList,
  getServiceBySlug,
  getServicesList,
  getNewHomeBlocks,
  getTeamMembersList,
  getAwardsList,
  getWhyUsList,
  getTestimonialsList,
} from "@/lib/cms/contentAccess";

export function useCmsContent() {
  const { snapshot, mode, loading, cmsEmpty, refetch } = useCms();

  return useMemo(
    () => ({
      loading,
      mode,
      cmsEmpty,
      refetch,
      projects: getProjectsList(snapshot, mode),
      getProject: (slug: string) => getProjectBySlug(slug, snapshot, mode),
      getRelatedProjects: (slug: string, limit?: number) =>
        getRelatedProjectsList(slug, snapshot, mode, limit),
      journalPosts: getJournalList(snapshot, mode),
      getPost: (slug: string) => getJournalBySlug(slug, snapshot, mode),
      faqCategories: getFaqCategories(snapshot, mode),
      faqSchemaEntities: getFaqSchemaFromCategories(getFaqCategories(snapshot, mode)),
      services: getServicesList(snapshot, mode),
      getService: (slug: string) => getServiceBySlug(slug, snapshot, mode),
      testimonials: getTestimonialsList(snapshot, mode),
      teamMembers: getTeamMembersList(snapshot, mode),
      awards: getAwardsList(snapshot, mode),
      whyUs: getWhyUsList(snapshot, mode),
      siteSettings: snapshot?.siteSettings ?? {},
      marketingPages: snapshot?.marketingPages ?? {},
      newHome: getNewHomeBlocks(snapshot, mode),
    }),
    [snapshot, mode, loading, cmsEmpty, refetch],
  );
}
