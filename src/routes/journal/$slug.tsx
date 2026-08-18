import { createFileRoute, notFound } from "@tanstack/react-router";
import { JournalArticlePage } from "@/components/pages/journal-article-page";
import { fetchJournalBySlug } from "@/lib/cms/contentAccess";

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    const post = await fetchJournalBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug}, Twentyone06`,
      },
      {
        name: "description",
        content: "Twentyone06 blog article.",
      },
    ],
  }),
  component: JournalArticleRoute,
});

function JournalArticleRoute() {
  const { post } = Route.useLoaderData();
  return <JournalArticlePage post={post} />;
}
