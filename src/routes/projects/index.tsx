import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/pages/projects-page";
import { projectsPage } from "@/data/content";
import { fetchProjectsList } from "@/lib/cms/contentAccess";

export type ProjectsSearch = {
  service?: string;
};

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => ({
    service:
      typeof search.service === "string" && search.service.length > 0
        ? search.service
        : undefined,
  }),
  loader: async () => ({ projects: await fetchProjectsList() }),
  head: () => ({
    meta: [
      { title: projectsPage.seo.title },
      { name: "description", content: projectsPage.seo.description },
      { name: "keywords", content: projectsPage.seo.keywords.join(", ") },
      { property: "og:title", content: projectsPage.seo.title },
      { property: "og:description", content: projectsPage.seo.description },
    ],
  }),
  component: ProjectsPage,
});
