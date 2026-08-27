import { createFileRoute, notFound } from "@tanstack/react-router";
import { JournalArticlePage } from "@/components/pages/journal-article-page";
import { fetchJournalBySlug } from "@/lib/cms/contentAccess";

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    const post = await fetchJournalBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.post.title ?? "Article"}, Twentyone06`,
      },
      {
        name: "description",
        content: loaderData?.post.excerpt ?? "Studio notes from Twentyone06.",
      },
      { property: "og:title", content: `${loaderData?.post.title ?? "Article"}, Twentyone06` },
      {
        property: "og:description",
        content: loaderData?.post.excerpt ?? "Studio notes from Twentyone06.",
      },
    ],
  }),
  component: JournalArticleRoute,
});

function JournalArticleRoute() {
  const { post } = Route.useLoaderData();
  return <JournalArticlePage post={post} />;
}
