import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/pages/terms-page";
import { termsPage } from "@/data/content";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/terms")({
  loader: async () => ({
    seo: await fetchMarketingSeo("terms", termsPage.seo),
  }),
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? termsPage.seo),
  component: TermsPage,
});
