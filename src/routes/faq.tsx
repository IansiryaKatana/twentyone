import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/pages/faq-page";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Twentyone06" },
      {
        name: "description",
        content:
          "Answers about Twentyone06’s design process, timelines, investment, and aftercare.",
      },
    ],
  }),
  component: FaqPage,
});
