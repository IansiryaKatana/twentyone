import { createFileRoute } from "@tanstack/react-router";
import { AdminJournal } from "@/admin/AdminJournal";

export const Route = createFileRoute("/admin/journal")({
  head: () => ({
    meta: [{ title: "Journal - Twentyone06 Admin" }],
  }),
  component: AdminJournal,
});
