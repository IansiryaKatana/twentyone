/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "@/styles/app.css?url";
import favicon from "@/Assets/favicon.png?url";
import { NotFoundPage } from "@/components/pages/not-found-page";
import { ScrollToTop } from "@/components/scroll-to-top";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { CmsProvider } from "@/contexts/CmsContext";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Twentyone06 — Design by the People, For the People.",
      },
      {
        name: "description",
        content:
          "TwentyOne06 is a Dubai-based boutique design studio specializing in interior design and branding for hospitality and F&B — impactful, intentional, and bold.",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: favicon },
      { rel: "shortcut icon", type: "image/png", href: favicon },
      { rel: "apple-touch-icon", href: favicon },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@300;400;500;600;700;800;900&family=Inter+Tight:wght@300;400&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <AdminAuthProvider>
        <CmsProvider>
          <Outlet />
          <ScrollToTop />
        </CmsProvider>
      </AdminAuthProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
