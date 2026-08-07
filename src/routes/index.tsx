import { createFileRoute } from "@tanstack/react-router";
import { NewHomePage } from "@/components/pages/new-home-page";
import { newHome } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: newHome.seo.title },
      { name: "description", content: newHome.seo.description },
      { name: "keywords", content: newHome.seo.keywords.join(", ") },
      { property: "og:title", content: newHome.seo.title },
      { property: "og:description", content: newHome.seo.description },
    ],
  }),
  component: NewHomePage,
});
