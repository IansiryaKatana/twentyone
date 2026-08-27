import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileText,
  HelpCircle,
  Image,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquareQuote,
  Newspaper,
  PanelsTopLeft,
  Settings,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import type { AdminRole } from "@/integrations/supabase/database.types";
import { BrandLogo } from "@/components/brand-logo";
import {
  adminNavClass,
  adminShell,
  adminSidebar,
} from "@/admin/adminClassNames";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AdminRole[];
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/journal", label: "Journal", icon: BookOpen },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/services", label: "Services", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/team", label: "Team", icon: UserRound },
  { to: "/admin/awards", label: "Awards", icon: Trophy },
  { to: "/admin/why-us", label: "Why Us", icon: Sparkles },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/backgrounds", label: "Backgrounds", icon: PanelsTopLeft },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/marketing", label: "Marketing", icon: Newspaper },
  { to: "/admin/site", label: "Site settings", icon: Settings },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
    roles: ["owner", "admin"],
  },
];

function canSeeNav(role: AdminRole | null, item: NavItem): boolean {
  if (!item.roles) return true;
  if (!role) return false;
  return item.roles.includes(role);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { adminUser, role, signOut } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = NAV.filter((item) => canSeeNav(role, item));

  const sidebar = (
    <aside className={`${adminSidebar} h-full w-64 shrink-0 overflow-hidden`}>
      <div className="shrink-0 border-b border-white/5 px-5 py-5">
        <BrandLogo surface="dark" />
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">Admin Portal</p>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active =
            item.to === "/admin"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={adminNavClass(active)}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/5 px-5 py-4">
        <p className="truncate text-sm text-white">{adminUser?.display_name ?? adminUser?.email}</p>
        <p className="text-xs uppercase tracking-[0.14em] text-white/45">{role ?? "-"}</p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-3 inline-flex w-full items-center justify-between gap-2 rounded-[var(--admin-radius-lg)] bg-[var(--admin-primary)] px-3 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <span>Sign out</span>
          <ArrowUpRight className="size-4 shrink-0" />
        </button>
      </div>
    </aside>
  );

  return (
    <div className={`admin-theme ${adminShell} h-screen overflow-hidden`}>
      <div className="flex h-full min-h-0">
        <div className="hidden h-full shrink-0 md:block">{sidebar}</div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 h-full w-64 shadow-xl">{sidebar}</div>
          </div>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="z-40 flex shrink-0 items-center gap-3 border-b border-[var(--admin-border)] bg-white px-4 py-3 md:hidden">
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--admin-ink)] hover:bg-[var(--admin-bg)]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <span className="font-detective text-[18px] font-bold uppercase">Admin</span>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
