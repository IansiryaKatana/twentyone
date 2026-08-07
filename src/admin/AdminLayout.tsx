import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminShell } from "@/admin/AdminShell";
import "@/admin/admin-theme.css";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, configured, session, adminUser, isAdmin } = useAdminAuth();

  const isLogin = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLogin || loading) return;
    if (!configured) return;
    if (!session || !adminUser?.is_active || !isAdmin) {
      void navigate({
        to: "/admin/login",
        search: { from: location.pathname },
      });
    }
  }, [
    isLogin,
    loading,
    configured,
    session,
    adminUser,
    isAdmin,
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

  if (loading) {
    return (
      <div className="admin-theme adminShell flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--admin-primary)]" />
      </div>
    );
  }

  if (!session || !adminUser?.is_active || !isAdmin) {
    return null;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
