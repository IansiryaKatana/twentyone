import { createFileRoute } from "@tanstack/react-router";
import { ServicesIndexPage } from "@/components/pages/services-index-page";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Twentyone06" },
      {
        name: "description",
        content:
          "Residential design, commercial spaces, bespoke furniture, lighting, and art curation by Twentyone06.",
      },
    ],
  }),
  component: ServicesIndexPage,
});
