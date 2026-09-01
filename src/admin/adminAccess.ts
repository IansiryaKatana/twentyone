import type { AdminRole } from "@/integrations/supabase/database.types";

export const OWNER_ONLY_ADMIN_PATHS = [
  "/admin/backgrounds",
  "/admin/marketing",
  "/admin/site",
] as const;

export function isOwnerOnlyAdminPath(pathname: string): boolean {
  return OWNER_ONLY_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function canAccessAdminPath(
  role: AdminRole | null,
  pathname: string,
): boolean {
  if (!role) return false;
  if (isOwnerOnlyAdminPath(pathname)) return role === "owner";
  return true;
}

export function assignableAdminRoles(role: AdminRole | null): AdminRole[] {
  if (role === "owner") return ["owner", "admin", "editor", "viewer"];
  return ["admin", "editor", "viewer"];
}
