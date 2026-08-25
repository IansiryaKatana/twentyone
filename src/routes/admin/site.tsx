import { createFileRoute } from "@tanstack/react-router";
import { AdminSite } from "@/admin/AdminSite";

export const Route = createFileRoute("/admin/site")({
  head: () => ({
    meta: [{ title: "Site settings - Twentyone06 Admin" }],
  }),
  component: AdminSite,
});
