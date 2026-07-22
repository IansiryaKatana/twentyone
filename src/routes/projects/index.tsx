import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/pages/projects-page";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Twentyone06" },
      {
        name: "description",
        content:
          "Explore curated luxury interior projects by Twentyone06 across residences and hospitality.",
      },
    ],
  }),
  component: ProjectsPage,
});
