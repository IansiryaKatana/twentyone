import { createFileRoute } from "@tanstack/react-router";
import { AdminMarketing } from "@/admin/AdminMarketing";

export const Route = createFileRoute("/admin/marketing")({
  head: () => ({
    meta: [{ title: "Marketing — Twentyone06 Admin" }],
  }),
  component: AdminMarketing,
});
