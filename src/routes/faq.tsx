import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/pages/faq-page";
import { faqPage } from "@/data/content";
import { fetchFaqCategories, getFaqSchemaFromCategories } from "@/lib/cms/contentAccess";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    const [categories, seo] = await Promise.all([
      fetchFaqCategories(),
      fetchMarketingSeo("faq", faqPage.seo),
    ]);
    return { categories, seo };
  },
  head: ({ loaderData }) => ({
    ...pageSeoHead(loaderData?.seo ?? faqPage.seo),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: getFaqSchemaFromCategories(loaderData?.categories ?? []),
        }),
      },
    ],
  }),
  component: FaqPage,
});
