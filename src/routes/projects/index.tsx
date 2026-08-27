import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/pages/projects-page";
import { projectsPage } from "@/data/content";
import { fetchProjectsList } from "@/lib/cms/contentAccess";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

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
  loader: async () => {
    const [projects, seo] = await Promise.all([
      fetchProjectsList(),
      fetchMarketingSeo("projects", projectsPage.seo),
    ]);
    return { projects, seo };
  },
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? projectsPage.seo),
  component: ProjectsPage,
});
