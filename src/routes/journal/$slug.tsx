import { createFileRoute } from "@tanstack/react-router";
import { JournalArticlePage } from "@/components/pages/journal-article-page";
import { getPost } from "@/data/content";

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => {
    const post = getPost(params.slug);
    return {
      meta: [
        {
          title: post ? `${post.title} — Twentyone06` : "Journal — Twentyone06",
        },
        {
          name: "description",
          content: post?.excerpt ?? "Twentyone06 journal article.",
        },
      ],
    };
  },
  component: JournalArticleRoute,
});

function JournalArticleRoute() {
  const { slug } = Route.useParams();
  return <JournalArticlePage slug={slug} />;
}
