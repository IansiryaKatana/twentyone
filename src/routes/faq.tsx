import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/pages/faq-page";
import { faqPage } from "@/data/content";
import { fetchFaqCategories, getFaqSchemaFromCategories } from "@/lib/cms/contentAccess";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    const categories = await fetchFaqCategories();
    return { categories };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: faqPage.seo.title },
      { name: "description", content: faqPage.seo.description },
      { name: "keywords", content: faqPage.seo.keywords.join(", ") },
      { property: "og:title", content: faqPage.seo.title },
      { property: "og:description", content: faqPage.seo.description },
    ],
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
