import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections/site-footer";

export function PageShell({
  children,
  headerVariant = "solid",
}: {
  children: ReactNode;
  headerVariant?: "overlay" | "solid";
}) {
  return (
    <div className="relative min-h-screen bg-cream">
      <SiteHeader variant={headerVariant} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
