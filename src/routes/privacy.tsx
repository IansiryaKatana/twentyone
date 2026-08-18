import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/pages/privacy-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy, Twentyone06" },
      {
        name: "description",
        content:
          "How TwentyOne06 collects, uses, and protects your personal data under the UAE PDPL.",
      },
    ],
  }),
  component: PrivacyPage,
});
