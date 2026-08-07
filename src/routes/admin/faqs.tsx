import { createFileRoute } from "@tanstack/react-router";
import { AdminFaqs } from "@/admin/AdminFaqs";

export const Route = createFileRoute("/admin/faqs")({
  head: () => ({
    meta: [{ title: "FAQs — Twentyone06 Admin" }],
  }),
  component: AdminFaqs,
});
