import { createFileRoute } from "@tanstack/react-router";
import { JournalIndexPage } from "@/components/pages/journal-index-page";
import { journalPage } from "@/data/content";
import { fetchJournalList } from "@/lib/cms/contentAccess";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/journal/")({
  loader: async () => ({
    posts: await fetchJournalList(),
    seo: await fetchMarketingSeo("journal", journalPage.seo),
  }),
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? journalPage.seo),
  component: JournalIndexPage,
});
