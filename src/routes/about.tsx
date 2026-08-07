import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/pages/about-page";
import { aboutPage } from "@/data/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: aboutPage.seo.title },
      { name: "description", content: aboutPage.seo.description },
      { name: "keywords", content: aboutPage.seo.keywords.join(", ") },
      { property: "og:title", content: aboutPage.seo.title },
      { property: "og:description", content: aboutPage.seo.description },
    ],
  }),
  component: AboutPage,
});
