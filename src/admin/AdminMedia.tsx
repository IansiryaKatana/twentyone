import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/database.types";
import { uploadCmsImage } from "@/lib/cms/uploadCmsImage";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { useAdminTablePagination } from "@/admin/useAdminTablePagination";
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminInput,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTableWrap,
  adminToolbar,
} from "@/admin/adminClassNames";

type Row = Tables<"cms_media">;

export function AdminMedia() {
  const { role } = useAdminAuth();
  const canMutate = role !== "viewer";
  const inputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb
      .from("cms_media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    else {
      setErr(null);
      setRows(data ?? []);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = rows.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      row.file_name.toLowerCase().includes(q) ||
      row.folder.toLowerCase().includes(q)
    );
  });

  const pagination = useAdminTablePagination(filtered);

  const onUpload = async (file: File | null) => {
    if (!file || !canMutate) return;
    const sb = getSupabase();
    if (!sb) return;
    setUploading(true);
    setErr(null);
    try {
      await uploadCmsImage(sb, file, { folder: "general" });
      await refresh();
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || !canMutate) return;
    const sb = getSupabase();
    if (!sb) return;
    const row = rows.find((r) => r.id === deleteId);
    if (row) {
      await sb.storage.from("cms-media").remove([row.storage_path]);
      await sb.from("cms_media").delete().eq("id", deleteId);
    }
    setDeleteId(null);
    await refresh();
  };

  return (
    <div>
      <AdminPageHeading
        title="Media library"
        description="Uploaded assets indexed for reuse across the CMS."
        actions={
          canMutate ? (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                className={adminBtnPrimary}
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="size-4" />
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </>
          ) : null
        }
      />

      {err ? <p className="mb-4 text-sm text-red-600">{err}</p> : null}

      <div className={adminTableWrap}>
        <div className={adminToolbar}>
          <input
            className={adminInput}
            placeholder="Search…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pagination.resetPage();
            }}
          />
        </div>
        <table className={adminTable}>
          <thead>
            <tr>
              <th className={adminTableHeadCell}>Preview</th>
              <th className={adminTableHeadCell}>Name</th>
              <th className={adminTableHeadCell}>Folder</th>
              <th className={adminTableHeadCell}>Kind</th>
              <th className={adminTableHeadCell} />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {pagination.pageRows.map((row) => (
              <tr key={row.id}>
                <td className={adminTableCell}>
                  {row.kind === "image" ? (
                    <img src={row.public_url} alt="" className="size-12 rounded object-cover" />
                  ) : (
                    row.kind
                  )}
                </td>
                <td className={adminTableCell}>{row.file_name}</td>
                <td className={adminTableCell}>{row.folder}</td>
                <td className={adminTableCell}>{row.kind}</td>
                <td className={adminTableCell}>
                  {canMutate ? (
                    <button type="button" className={adminBtnDanger} onClick={() => setDeleteId(row.id)}>
                      <Trash2 className="size-4" />
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminTablePagination {...pagination} onPageChange={pagination.setPage} />
      </div>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete media"
        description="Removes the storage object and database row."
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
        saveVariant="danger"
        side="bottom"
      />
    </div>
  );
}
