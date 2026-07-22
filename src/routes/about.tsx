import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/pages/about-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Twentyone06" },
      {
        name: "description",
        content:
          "Twentyone06 is an interior design studio crafting timeless spaces with elegance, precision, and quiet luxury.",
      },
    ],
  }),
  component: AboutPage,
});
