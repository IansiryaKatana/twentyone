import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/contact-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Let's Talk — TwentyOne06" },
      {
        name: "description",
        content:
          "We design spaces for people. Let's start with yours. Share your brief with TwentyOne06 — interior design, branding, design management, and strategy across Dubai and the GCC.",
      },
    ],
  }),
  component: ContactPage,
});
