import { createFileRoute } from "@tanstack/react-router";
import { AdminAwards } from "@/admin/AdminAwards";

export const Route = createFileRoute("/admin/awards")({
  head: () => ({
    meta: [{ title: "Awards - Twentyone06 Admin" }],
  }),
  component: AdminAwards,
});
