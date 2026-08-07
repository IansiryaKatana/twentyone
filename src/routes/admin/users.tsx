import { createFileRoute } from "@tanstack/react-router";
import { AdminUsers } from "@/admin/AdminUsers";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [{ title: "Users — Twentyone06 Admin" }],
  }),
  component: AdminUsers,
});
