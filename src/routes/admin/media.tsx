import { createFileRoute } from "@tanstack/react-router";
import { AdminMedia } from "@/admin/AdminMedia";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [{ title: "Media - Twentyone06 Admin" }],
  }),
  component: AdminMedia,
});
