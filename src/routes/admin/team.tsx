import { createFileRoute } from "@tanstack/react-router";
import { AdminTeam } from "@/admin/AdminTeam";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [{ title: "Team — Twentyone06 Admin" }],
  }),
  component: AdminTeam,
});
