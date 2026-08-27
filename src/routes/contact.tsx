import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/contact-page";
import { contactPage } from "@/data/content";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/contact")({
  loader: async () => ({
    seo: await fetchMarketingSeo("contact", contactPage.seo),
  }),
  head: ({ loaderData }) => pageSeoHead(loaderData?.seo ?? contactPage.seo),
  component: ContactPage,
});
