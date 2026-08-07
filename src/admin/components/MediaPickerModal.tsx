import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/database.types";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { useAdminTablePagination } from "@/admin/useAdminTablePagination";
import {
  adminBtnSecondary,
  adminInput,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTableWrap,
} from "@/admin/adminClassNames";

type MediaRow = Tables<"cms_media">;

type MediaPickerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  kind?: string;
};

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  kind,
}: MediaPickerModalProps) {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    let query = sb.from("cms_media").select("*").order("created_at", { ascending: false });
    if (kind) query = query.eq("kind", kind);
    const { data, error } = await query;
    if (!error) setRows(data ?? []);
    setLoading(false);
  }, [kind]);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  const filtered = rows.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      row.file_name.toLowerCase().includes(q) ||
      row.folder.toLowerCase().includes(q) ||
      row.public_url.toLowerCase().includes(q)
    );
  });

  const pagination = useAdminTablePagination(filtered);

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title="Media library"
      description="Select an asset to use in this field."
      wide
      footer={
        <button type="button" className={adminBtnSecondary} onClick={() => onOpenChange(false)}>
          Cancel
        </button>
      }
    >
      <div className="space-y-4">
        <input
          className={adminInput}
          placeholder="Search by name, folder, or URL…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            pagination.resetPage();
          }}
        />

        <div className={adminTableWrap}>
          <table className={adminTable}>
            <thead>
              <tr>
                <th className={adminTableHeadCell}>Preview</th>
                <th className={adminTableHeadCell}>Name</th>
                <th className={adminTableHeadCell}>Folder</th>
                <th className={adminTableHeadCell} />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className={`${adminTableCell} py-8 text-center text-[var(--admin-muted)]`}>
                    Loading…
                  </td>
                </tr>
              ) : pagination.pageRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className={`${adminTableCell} py-8 text-center text-[var(--admin-muted)]`}>
                    No media found.
                  </td>
                </tr>
              ) : (
                pagination.pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-[var(--admin-bg)]">
                    <td className={adminTableCell}>
                      {row.kind === "image" ? (
                        <img
                          src={row.public_url}
                          alt=""
                          className="size-12 rounded object-cover"
                        />
                      ) : (
                        <span className="text-xs uppercase">{row.kind}</span>
                      )}
                    </td>
                    <td className={adminTableCell}>{row.file_name}</td>
                    <td className={adminTableCell}>{row.folder}</td>
                    <td className={adminTableCell}>
                      <button
                        type="button"
                        className="text-sm font-medium text-[var(--admin-primary)] hover:underline"
                        onClick={() => onSelect(row.public_url)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <AdminTablePagination {...pagination} onPageChange={pagination.setPage} />
        </div>
      </div>
    </AdminModal>
  );
}
