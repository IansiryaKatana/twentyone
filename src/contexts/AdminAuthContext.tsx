import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { AdminRole, Tables } from "@/integrations/supabase/database.types";

type AdminUser = Tables<"admin_users">;

type AdminAuthContextValue = {
  loading: boolean;
  configured: boolean;
  user: User | null;
  session: Session | null;
  adminUser: AdminUser | null;
  role: AdminRole | null;
  isAdmin: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshAdminUser: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const ADMIN_ACCESS_ROLES: AdminRole[] = ["owner", "admin", "editor", "viewer"];

async function fetchAdminUser(
  authUserId: string,
  email: string | undefined,
): Promise<AdminUser | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const byAuth = await sb
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (byAuth.data) return byAuth.data;

  if (email) {
    const byEmail = await sb
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (byEmail.data) return byEmail.data;
  }

  return null;
}

async function ensureCurrentUserRecord(
  session: Session,
): Promise<AdminUser | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const existing = await fetchAdminUser(session.user.id, session.user.email);
  if (existing) return existing;

  const { count, error: countError } = await sb
    .from("admin_users")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("[AdminAuth] failed to count admin_users:", countError.message);
    return null;
  }

  if ((count ?? 0) > 0) return null;

  const email = session.user.email;
  if (!email) return null;

  const now = new Date().toISOString();
  const insertRow = {
    id: crypto.randomUUID(),
    auth_user_id: session.user.id,
    email,
    role: "owner" as const,
    is_active: true,
    display_name: session.user.user_metadata?.full_name ?? email.split("@")[0],
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await sb
    .from("admin_users")
    .insert(insertRow)
    .select("*")
    .single();

  if (error) {
    console.error("[AdminAuth] failed to bootstrap owner:", error.message);
    return null;
  }

  return data;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const syncAdminUser = useCallback(async (nextSession: Session | null) => {
    if (!nextSession) {
      setAdminUser(null);
      return;
    }

    let record = await fetchAdminUser(nextSession.user.id, nextSession.user.email);
    if (!record) {
      record = await ensureCurrentUserRecord(nextSession);
    }
    setAdminUser(record);
  }, []);

  const refreshAdminUser = useCallback(async () => {
    if (!session) {
      setAdminUser(null);
      return;
    }
    await syncAdminUser(session);
  }, [session, syncAdminUser]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    let mounted = true;

    void sb.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      void syncAdminUser(data.session).finally(() => {
        if (mounted) setLoading(false);
      });
    });

    const { data: subscription } = sb.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void syncAdminUser(nextSession);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [syncAdminUser]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const sb = getSupabase();
      if (!sb) {
        return { error: "Supabase is not configured." };
      }

      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }

      setSession(data.session);
      await syncAdminUser(data.session);
      return { error: null };
    },
    [syncAdminUser],
  );

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setSession(null);
    setAdminUser(null);
  }, []);

  const role = adminUser?.is_active ? adminUser.role : null;
  const isAdmin = Boolean(
    adminUser?.is_active && role && ADMIN_ACCESS_ROLES.includes(role),
  );

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      loading,
      configured,
      user: session?.user ?? null,
      session,
      adminUser,
      role,
      isAdmin,
      signInWithPassword,
      signOut,
      refreshAdminUser,
    }),
    [
      loading,
      configured,
      session,
      adminUser,
      role,
      isAdmin,
      signInWithPassword,
      signOut,
      refreshAdminUser,
    ],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
