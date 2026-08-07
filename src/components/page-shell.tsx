import type { ReactNode } from "react";
import { NhHeader } from "@/components/new-home/nh-header";
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
      <NhHeader variant={headerVariant} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
