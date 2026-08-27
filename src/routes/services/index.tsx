import { createFileRoute } from "@tanstack/react-router";
import { servicesPage } from "@/data/content";
import { ServicesIndexPage } from "@/components/pages/services-index-page";
import { fetchMarketingSeo, pageSeoHead } from "@/lib/cms/pageSeo";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://twentyone06.com/#organization",
      name: "TwentyOne06",
      url: "https://twentyone06.com",
      email: "info@twentyone06.com",
      telephone: "+97145548082",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Al Maktab, Office 304, 23rd St, Al Barsha First",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
      areaServed: ["Dubai", "UAE", "Saudi Arabia", "Kuwait", "GCC"],
      description: servicesPage.seo.description,
    },
    ...servicesPage.sections.map((section) => ({
      "@type": "Service",
      name: section.title,
      serviceType: section.title,
      description: section.body.join(" "),
      provider: { "@id": "https://twentyone06.com/#organization" },
      areaServed: ["Dubai", "UAE", "Saudi Arabia", "Kuwait", "GCC"],
      url: `https://twentyone06.com/services#${section.id}`,
    })),
  ],
};

export const Route = createFileRoute("/services/")({
  loader: async () => ({
    seo: await fetchMarketingSeo("services", servicesPage.seo),
  }),
  head: ({ loaderData }) => ({
    ...pageSeoHead(loaderData?.seo ?? servicesPage.seo),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(schema),
      },
    ],
  }),
  component: ServicesIndexPage,
});
