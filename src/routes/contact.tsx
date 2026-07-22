import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/contact-page";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Twentyone06" },
      {
        name: "description",
        content:
          "Start your design journey with Twentyone06. Book a private consultation or inquire about a project.",
      },
    ],
  }),
  component: ContactPage,
});
