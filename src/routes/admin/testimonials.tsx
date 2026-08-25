import { createFileRoute } from "@tanstack/react-router";
import { AdminTestimonials } from "@/admin/AdminTestimonials";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [{ title: "Testimonials - Twentyone06 Admin" }],
  }),
  component: AdminTestimonials,
});
