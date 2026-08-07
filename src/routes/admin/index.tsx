import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/admin/AdminDashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard — Twentyone06 Admin" }],
  }),
  component: AdminDashboard,
});
