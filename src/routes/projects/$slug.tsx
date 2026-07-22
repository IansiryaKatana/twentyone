import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/pages/project-detail-page";
import { getProject } from "@/data/content";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const project = getProject(params.slug);
    return {
      meta: [
        {
          title: project
            ? `${project.title} — Twentyone06`
            : "Project — Twentyone06",
        },
        {
          name: "description",
          content: project?.excerpt ?? "Twentyone06 project detail.",
        },
      ],
    };
  },
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}
