import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/database.types";
import { useCms } from "@/contexts/CmsContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { AdminFilters } from "@/admin/components/AdminFilters";
import { AdminBulkBar } from "@/admin/components/AdminBulkBar";
import { useAdminTablePagination } from "@/admin/useAdminTablePagination";
import { useAdminSelection } from "@/admin/useAdminSelection";
import { useAdminReorder } from "@/admin/useAdminReorder";
import { AdminDndProvider, AdminSortableBody, AdminSortableTr } from "@/admin/components/AdminSortable";
import { matchesQuery, useAdminFilters, type AdminFilterDef } from "@/admin/useAdminFilters";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTableWrap,
  adminTextarea,
} from "@/admin/adminClassNames";

type Row = Tables<"why_us">;

const WHY_FILTERS: AdminFilterDef[] = [
  {
    key: "published",
    label: "Published",
    options: [
      { value: "yes", label: "Published" },
      { value: "no", label: "Unpublished" },
    ],
  },
];

function emptyRow(): Row {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "",
    body: "",
    sort_order: 0,
    published: true,
    created_at: now,
    updated_at: now,
  };
}

export function AdminWhyUs() {
  const { refetch } = useCms();
  const { role } = useAdminAuth();
  const canMutate = role !== "viewer";

  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Row | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

  const filterState = useAdminFilters(WHY_FILTERS);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (!matchesQuery(`${row.title} ${row.body}`, filterState.query)) return false;
      if (filterState.filters.published === "yes" && !row.published) return false;
      if (filterState.filters.published === "no" && row.published) return false;
      return true;
    });
  }, [rows, filterState.query, filterState.filters]);

  const pagination = useAdminTablePagination(filteredRows);
  const selection = useAdminSelection(filteredRows);
  const pageIds = pagination.pageRows.map((r) => r.id);

  const refresh = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data, error } = await sb
      .from("why_us")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setErr(error.message);
    else {
      setErr(null);
      setRows(data ?? []);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    pagination.resetPage();
  }, [filterState.query, filterState.filters, pagination.resetPage]);

  const reorder = useAdminReorder({
    table: "why_us",
    rows,
    setRows,
    pageRows: pagination.pageRows,
    page: pagination.page,
    pageSize: pagination.pageSize,
    canMutate,
    filtersActive: filterState.activeCount > 0,
    onError: setErr,
    onPersisted: () => refetch(),
    refresh,
  });

  const openCreate = () => {
    setDraft({ ...emptyRow(), sort_order: rows.length });
    setSaveErr(null);
    setModalOpen(true);
  };

  const openEdit = (row: Row) => {
    setDraft({ ...row });
    setSaveErr(null);
    setModalOpen(true);
  };

  const save = async () => {
    if (!draft || !canMutate) return;
    if (!draft.title.trim() || !draft.body.trim()) {
      setSaveErr("Title and body are required.");
      return;
    }

    const sb = getSupabase();
    if (!sb) return;

    setSaving(true);
    setSaveErr(null);
    const { error } = await sb.from("why_us").upsert(
      {
        ...draft,
        title: draft.title.trim(),
        body: draft.body.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    setSaving(false);

    if (error) {
      setSaveErr(error.message);
      return;
    }

    setModalOpen(false);
    setDraft(null);
    await refresh();
    await refetch();
  };

  const confirmDelete = async () => {
    if (!deleteId || !canMutate) return;
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from("why_us").delete().eq("id", deleteId);
    if (error) setErr(error.message);
    else {
      setDeleteId(null);
      await refresh();
      await refetch();
    }
  };

  const setPublishedBulk = async (published: boolean) => {
    if (!canMutate || selection.selectedCount === 0) return;
    const sb = getSupabase();
    if (!sb) return;
    setBulkBusy(true);
    const { error } = await sb
      .from("why_us")
      .update({ published, updated_at: new Date().toISOString() })
      .in("id", selection.selectedList);
    setBulkBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    selection.clear();
    await refresh();
    await refetch();
  };

  const confirmBulkDelete = async () => {
    if (!canMutate || selection.selectedCount === 0) return;
    const sb = getSupabase();
    if (!sb) return;
    setBulkBusy(true);
    const { error } = await sb.from("why_us").delete().in("id", selection.selectedList);
    setBulkBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setBulkDeleteOpen(false);
    selection.clear();
    await refresh();
    await refetch();
  };

  return (
    <div>
      <AdminPageHeading
        title="Why Us"
        description="Why TwentyOne06 cards on the About page. Drag rows to set display order."
        actions={
          canMutate ? (
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              <Plus className="size-4" />
              Add reason
            </button>
          ) : null
        }
      />

      {err ? <p className="mb-4 text-sm text-red-600">{err}</p> : null}
      {reorder.reordering ? (
        <p className="mb-4 text-sm text-[var(--admin-muted)]">Saving order…</p>
      ) : null}

      <div className={adminTableWrap}>
        <AdminFilters
          query={filterState.query}
          onQueryChange={filterState.setQuery}
          queryPlaceholder="Search title or body…"
          filterDefs={WHY_FILTERS}
          filters={filterState.filters}
          onFilterChange={filterState.setFilter}
          onReset={filterState.reset}
          activeCount={filterState.activeCount}
          trailing={
            <p className="text-sm text-[var(--admin-muted)] md:ml-auto">
              {filteredRows.length} of {rows.length}
            </p>
          }
        />

        {canMutate ? (
          <AdminBulkBar
            count={selection.selectedCount}
            onClear={selection.clear}
            busy={bulkBusy}
            onPublish={() => void setPublishedBulk(true)}
            onUnpublish={() => void setPublishedBulk(false)}
            onDelete={() => setBulkDeleteOpen(true)}
          />
        ) : null}

        <AdminDndProvider
          sensors={reorder.sensors}
          collisionDetection={reorder.collisionDetection}
          onDragEnd={reorder.onDragEnd}
        >
          <table className={adminTable}>
            <thead>
              <tr>
                {canMutate ? (
                  <th className={adminTableHeadCell} aria-label="Reorder" />
                ) : null}
                {canMutate ? (
                  <th className={adminTableHeadCell}>
                    <input
                      type="checkbox"
                      aria-label="Select all on page"
                      checked={selection.pageAllSelected(pageIds)}
                      ref={(el) => {
                        if (el) el.indeterminate = selection.pageSomeSelected(pageIds);
                      }}
                      onChange={() => selection.toggleAll(pageIds)}
                    />
                  </th>
                ) : null}
                <th className={adminTableHeadCell}>Title</th>
                <th className={adminTableHeadCell}>Body</th>
                <th className={adminTableHeadCell}>Order</th>
                <th className={adminTableHeadCell}>Published</th>
                <th className={adminTableHeadCell}>Actions</th>
              </tr>
            </thead>
            <AdminSortableBody itemIds={reorder.itemIds}>
              {pagination.pageRows.map((row) => (
                <AdminSortableTr
                  key={row.id}
                  id={row.id}
                  canReorder={reorder.canReorder}
                  showHandle={canMutate}
                  selected={selection.isSelected(row.id)}
                  dragLabel={row.title}
                >
                  {canMutate ? (
                    <td className={adminTableCell}>
                      <input
                        type="checkbox"
                        checked={selection.isSelected(row.id)}
                        onChange={() => selection.toggle(row.id)}
                        aria-label={`Select ${row.title}`}
                      />
                    </td>
                  ) : null}
                  <td className={adminTableCell}>{row.title}</td>
                  <td className={`${adminTableCell} max-w-md truncate`}>{row.body}</td>
                  <td className={adminTableCell}>{row.sort_order}</td>
                  <td className={adminTableCell}>{row.published ? "Yes" : "No"}</td>
                  <td className={adminTableCell}>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className={adminBtnGhost}
                        onClick={() => openEdit(row)}
                        disabled={!canMutate}
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className={adminBtnGhost}
                        onClick={() => setDeleteId(row.id)}
                        disabled={!canMutate}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </AdminSortableTr>
              ))}
              {pagination.pageRows.length === 0 ? (
                <tr>
                  <td className={adminTableCell} colSpan={canMutate ? 7 : 5}>
                    No reasons match these filters.
                  </td>
                </tr>
              ) : null}
            </AdminSortableBody>
          </table>
        </AdminDndProvider>

        <AdminTablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          totalRows={pagination.totalRows}
          pageSize={pagination.pageSize}
          hasPrev={pagination.hasPrev}
          hasNext={pagination.hasNext}
        />
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(false);
            setDraft(null);
          }
        }}
        title={draft?.title ? "Edit reason" : "Add reason"}
        onSave={() => void save()}
        saveLabel={saving ? "Saving…" : "Save"}
        saving={saving}
      >
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className={adminLabel}>Title</label>
              <input
                className={adminInput}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                disabled={!canMutate}
              />
            </div>
            <div>
              <label className={adminLabel}>Body</label>
              <textarea
                className={adminTextarea}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                disabled={!canMutate}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={adminLabel}>Sort order</label>
                <input
                  className={adminInput}
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) =>
                    setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })
                  }
                  disabled={!canMutate}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                    disabled={!canMutate}
                  />
                  Published
                </label>
              </div>
            </div>
            {saveErr ? <p className="text-sm text-red-600">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete reason"
        description="This cannot be undone."
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
        saveVariant="danger"
        side="bottom"
      />

      <AdminModal
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected"
        description={`Permanently delete ${selection.selectedCount} item${selection.selectedCount === 1 ? "" : "s"}?`}
        onSave={() => void confirmBulkDelete()}
        saveLabel={`Delete ${selection.selectedCount}`}
        saveVariant="danger"
        side="bottom"
        saving={bulkBusy}
      />
    </div>
  );
}
