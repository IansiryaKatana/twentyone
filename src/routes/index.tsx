import { createFileRoute } from "@tanstack/react-router";
import { NewHomePage } from "@/components/pages/new-home-page";
import { newHome } from "@/data/content";
import { HOME_SEO_SLUGS } from "@/lib/cms/marketingCatalog";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/")({
  loader: async () => ({
    seo: await fetchMarketingSeo([...HOME_SEO_SLUGS], newHome.seo),
  }),
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? newHome.seo),
  component: NewHomePage,
});
