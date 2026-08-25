import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/admin/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin login - Twentyone06" }],
  }),
  component: AdminLogin,
});
