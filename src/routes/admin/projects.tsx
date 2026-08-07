import { createFileRoute } from "@tanstack/react-router";
import { AdminProjects } from "@/admin/AdminProjects";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({
    meta: [{ title: "Projects — Twentyone06 Admin" }],
  }),
  component: AdminProjects,
});
