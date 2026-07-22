import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/pages/service-detail-page";
import { getService } from "@/data/content";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = getService(params.slug);
    return {
      meta: [
        {
          title: service
            ? `${service.label} — Twentyone06`
            : "Service — Twentyone06",
        },
        {
          name: "description",
          content: service?.intro ?? "Twentyone06 design services.",
        },
      ],
    };
  },
  component: ServiceDetailRoute,
});

function ServiceDetailRoute() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage slug={slug} />;
}
