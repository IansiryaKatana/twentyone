import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { AdminRole, Tables } from "@/integrations/supabase/database.types";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { useAdminTablePagination } from "@/admin/useAdminTablePagination";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminSelect,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTableWrap,
  adminToolbar,
} from "@/admin/adminClassNames";

type Row = Tables<"admin_users">;

const ROLES: AdminRole[] = ["owner", "admin", "editor", "viewer"];

function emptyUser(): Row {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    auth_user_id: null,
    email: "",
    role: "editor",
    is_active: true,
    display_name: "",
    created_at: now,
    updated_at: now,
  };
}

async function callAdminUserAuth(body: Record<string, unknown>) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data: sessionData } = await sb.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const res = await fetch(`${url}/functions/v1/admin-user-auth`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? "Request failed");
  }
}

export function AdminUsers() {
  const { role, refreshAdminUser } = useAdminAuth();
  const canMutate = role === "owner" || role === "admin";

  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Row | null>(null);
  const [password, setPassword] = useState("");
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb.from("admin_users").select("*").order("email");
    if (error) setErr(error.message);
    else {
      setErr(null);
      setRows(data ?? []);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const pagination = useAdminTablePagination(rows);

  const save = async () => {
    if (!draft || !canMutate) return;
    if (!draft.email.trim()) {
      setSaveErr("Email is required.");
      return;
    }

    setSaving(true);
    setSaveErr(null);
    try {
      const sb = getSupabase();
      if (!sb) return;

      const isNew = !rows.some((r) => r.id === draft.id);
      if (isNew && password) {
        await callAdminUserAuth({
          action: "create_user",
          email: draft.email.trim(),
          password,
          role: draft.role,
          display_name: draft.display_name,
        });
        await refresh();
        await refreshAdminUser();
      } else {
        const { error } = await sb.from("admin_users").upsert(
          {
            ...draft,
            email: draft.email.trim(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
        if (error) throw new Error(error.message);
        if (password) {
          await callAdminUserAuth({
            action: "set_password",
            email: draft.email.trim(),
            password,
          });
        }
        await refresh();
      }
      setModalOpen(false);
      setPassword("");
    } catch (error) {
      setSaveErr(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (role !== "owner" && role !== "admin") {
    return (
      <AdminPageHeading
        title="Users"
        description="You do not have permission to manage admin users."
      />
    );
  }

  return (
    <div>
      <AdminPageHeading
        title="Admin users"
        description="Roles and access for the CMS."
        actions={
          canMutate ? (
            <button
              type="button"
              className={adminBtnPrimary}
              onClick={() => {
                setDraft(emptyUser());
                setPassword("");
                setSaveErr(null);
                setModalOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add user
            </button>
          ) : null
        }
      />

      {err ? <p className="mb-4 text-sm text-red-600">{err}</p> : null}

      <div className={adminTableWrap}>
        <div className={adminToolbar}>
          <p className="text-sm text-[var(--admin-muted)]">{rows.length} users</p>
        </div>
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTableHeadCell}>Email</th>
              <th className={adminTableHeadCell}>Role</th>
              <th className={adminTableHeadCell}>Active</th>
              <th className={adminTableHeadCell} />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {pagination.pageRows.map((row) => (
              <tr key={row.id}>
                <td className={adminTableCell}>{row.email}</td>
                <td className={adminTableCell}>{row.role}</td>
                <td className={adminTableCell}>{row.is_active ? "Yes" : "No"}</td>
                <td className={adminTableCell}>
                  <div className="flex justify-end gap-1">
                    {canMutate ? (
                      <>
                        <button
                          type="button"
                          className={adminBtnGhost}
                          onClick={() => {
                            setDraft({ ...row });
                            setPassword("");
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button type="button" className={adminBtnGhost} onClick={() => setDeleteId(row.id)}>
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminTablePagination {...pagination} onPageChange={pagination.setPage} />
      </div>

      <AdminModal open={modalOpen} onOpenChange={setModalOpen} title="Admin user" onSave={() => void save()} saving={saving}>
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className={adminLabel}>Email</label>
              <input
                className={adminInput}
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Display name</label>
              <input
                className={adminInput}
                value={draft.display_name ?? ""}
                onChange={(e) => setDraft({ ...draft, display_name: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Role</label>
              <select
                className={adminSelect}
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value as AdminRole })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={adminLabel}>
                Password {rows.some((r) => r.id === draft.id) ? "(leave blank to keep)" : ""}
              </label>
              <input
                className={adminInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
              />
              Active
            </label>
            {saveErr ? <p className="text-sm text-red-600">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete user"
        description="This cannot be undone."
        onSave={async () => {
          if (!deleteId || !canMutate) return;
          const sb = getSupabase();
          if (!sb) return;
          await sb.from("admin_users").delete().eq("id", deleteId);
          setDeleteId(null);
          await refresh();
        }}
        saveLabel="Delete"
        saveVariant="danger"
        side="bottom"
      />
    </div>
  );
}
