import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/pages/project-detail-page";
import { fetchProjectBySlug } from "@/lib/cms/contentAccess";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug}, Twentyone06`,
      },
      {
        name: "description",
        content: "Twentyone06 project detail.",
      },
    ],
  }),
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { project } = Route.useLoaderData();
  return <ProjectDetailPage project={project} />;
}
