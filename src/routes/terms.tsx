import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/pages/terms-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions, Twentyone06" },
      {
        name: "description",
        content:
          "Terms governing use of the TwentyOne06 website, enquiries, and related services.",
      },
    ],
  }),
  component: TermsPage,
});
