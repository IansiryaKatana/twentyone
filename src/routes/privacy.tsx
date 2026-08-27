import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/pages/privacy-page";
import { privacyPage } from "@/data/content";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/privacy")({
  loader: async () => ({
    seo: await fetchMarketingSeo("privacy", privacyPage.seo),
  }),
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? privacyPage.seo),
  component: PrivacyPage,
});
