import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/pages/about-page";
import { aboutPage } from "@/data/content";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/about")({
  loader: async () => ({
    seo: await fetchMarketingSeo("about", aboutPage.seo),
  }),
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? aboutPage.seo),
  component: AboutPage,
});
