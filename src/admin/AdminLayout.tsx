import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminShell } from "@/admin/AdminShell";
import { canAccessAdminPath } from "@/admin/adminAccess";
import "@/admin/admin-theme.css";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, configured, session, adminUser, isAdmin, role, signingOut } = useAdminAuth();

  const isLogin = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLogin || loading || signingOut) return;
    if (!configured) return;
    if (!session || !adminUser?.is_active || !isAdmin) {
      void navigate({
        to: "/admin/login",
        search: { from: location.pathname },
      });
      return;
    }
    if (!canAccessAdminPath(role, location.pathname)) {
      void navigate({ to: "/admin" });
    }
  }, [
    isLogin,
    signingOut,
    loading,
    configured,
    session,
    adminUser,
    isAdmin,
    role,
    navigate,
    location.pathname,
  ]);

  if (isLogin) {
    return <Outlet />;
  }

  if (!configured) {
    return (
      <div className="admin-theme adminShell flex min-h-screen items-center justify-center px-5">
        <p className="max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use
          the admin CMS.
        </p>
      </div>
    );
  }

  if (loading || signingOut || !session || !adminUser?.is_active || !isAdmin || !canAccessAdminPath(role, location.pathname)) {
    return (
      <div className="admin-theme adminShell flex min-h-screen items-center justify-center bg-[var(--admin-bg)]">
        <Loader2 className="size-8 animate-spin text-[var(--admin-primary)]" />
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
