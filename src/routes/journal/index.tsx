import { createFileRoute } from "@tanstack/react-router";
import { JournalIndexPage } from "@/components/pages/journal-index-page";
import { fetchJournalList } from "@/lib/cms/contentAccess";

export const Route = createFileRoute("/journal/")({
  loader: async () => ({ posts: await fetchJournalList() }),
  head: () => ({
    meta: [
      { title: "Our Blogs, Twentyone06" },
      {
        name: "description",
        content:
          "Studio notes on space, material, and modern living from Twentyone06.",
      },
    ],
  }),
  component: JournalIndexPage,
});
