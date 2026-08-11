import { createFileRoute } from "@tanstack/react-router";
import { AdminBackgrounds } from "@/admin/AdminBackgrounds";

export const Route = createFileRoute("/admin/backgrounds")({
  head: () => ({
    meta: [{ title: "Backgrounds — Twentyone06 Admin" }],
  }),
  component: AdminBackgrounds,
});
