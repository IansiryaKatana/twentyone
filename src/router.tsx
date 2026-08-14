import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFoundPage } from "@/components/pages/not-found-page";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultHashScrollIntoView: { behavior: "instant", block: "start" },
    defaultPreload: "intent",
    defaultNotFoundComponent: NotFoundPage,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
