import { createFileRoute } from "@tanstack/react-router";
import { JournalIndexPage } from "@/components/pages/journal-index-page";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Journal — Twentyone06" },
      {
        name: "description",
        content:
          "Studio notes on space, material, and modern living from Twentyone06.",
      },
    ],
  }),
  component: JournalIndexPage,
});
