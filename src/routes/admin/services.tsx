import { createFileRoute } from "@tanstack/react-router";
import { AdminServices } from "@/admin/AdminServices";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [{ title: "Services - Twentyone06 Admin" }],
  }),
  component: AdminServices,
});
