import { createFileRoute } from "@tanstack/react-router";
import { AdminWhyUs } from "@/admin/AdminWhyUs";

export const Route = createFileRoute("/admin/why-us")({
  head: () => ({
    meta: [{ title: "Why Us - Twentyone06 Admin" }],
  }),
  component: AdminWhyUs,
});
