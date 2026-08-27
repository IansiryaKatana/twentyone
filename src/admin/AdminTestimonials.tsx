import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { getSupabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/database.types";
import { useCms } from "@/contexts/CmsContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { AdminFilters } from "@/admin/components/AdminFilters";
import { AdminBulkBar } from "@/admin/components/AdminBulkBar";
import { EntityDetailSheet } from "@/admin/components/EntityDetailSheet";
import { ImageUploadField } from "@/admin/components/ImageUploadField";
import { AdminDndProvider, AdminSortableBody, AdminSortableTr } from "@/admin/components/AdminSortable";
import { useAdminTablePagination } from "@/admin/useAdminTablePagination";
import { useAdminSelection } from "@/admin/useAdminSelection";
import { useAdminReorder } from "@/admin/useAdminReorder";
import { matchesQuery, useAdminFilters, type AdminFilterDef } from "@/admin/useAdminFilters";
import { AdminSelect } from "@/admin/components/AdminSelect";
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

type Row = Tables<"testimonials">;

const TESTIMONIAL_FILTERS: AdminFilterDef[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
  },
  {
    key: "published",
    label: "Published",
    options: [
      { value: "yes", label: "Published" },
      { value: "no", label: "Unpublished" },
    ],
  },
];

function emptyRow(sortOrder = 0): Row {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    quote: "",
    name: "",
    role: "",
    image: "",
    status: "approved",
    sort_order: sortOrder,
    published: true,
    created_at: now,
    updated_at: now,
  };
}

export function AdminTestimonials() {
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
  const [viewRow, setViewRow] = useState<Row | null>(null);

  const filterState = useAdminFilters(TESTIMONIAL_FILTERS);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (!matchesQuery(`${row.name} ${row.quote} ${row.role}`, filterState.query)) {
        return false;
      }
      if (
        filterState.filters.status !== "all" &&
        row.status !== filterState.filters.status
      ) {
        return false;
      }
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
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setErr(error.message);
    else {
      setErr(null);
      setRows(data ?? []);
    }
  }, []);

  const reorder = useAdminReorder({
    table: "testimonials",
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

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    pagination.resetPage();
  }, [filterState.query, filterState.filters, pagination.resetPage]);

  const openCreate = () => {
    setDraft(emptyRow(rows.length));
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
    if (!draft.quote.trim() || !draft.name.trim()) {
      setSaveErr("Quote and name are required.");
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    setSaveErr(null);
    const { error } = await sb.from("testimonials").upsert(
      { ...draft, updated_at: new Date().toISOString() },
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
    const { error } = await sb.from("testimonials").delete().eq("id", deleteId);
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
    const update: { published: boolean; status?: string; updated_at: string } = {
      published,
      updated_at: new Date().toISOString(),
    };
    if (published) update.status = "approved";
    const { error } = await sb
      .from("testimonials")
      .update(update)
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
    const { error } = await sb.from("testimonials").delete().in("id", selection.selectedList);
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

  const colSpan = canMutate ? 6 : 4;

  return (
    <div>
      <AdminPageHeading
        title="Testimonials"
        description="Client quotes with moderation status. Drag rows to set homepage order."
        actions={
          canMutate ? (
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              <Plus className="size-4" />
              Add testimonial
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
          queryPlaceholder="Search name, quote, role…"
          filterDefs={TESTIMONIAL_FILTERS}
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
                {canMutate ? <th className={adminTableHeadCell} aria-label="Reorder" /> : null}
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
                <th className={adminTableHeadCell}>Name</th>
                <th className={adminTableHeadCell}>Status</th>
                <th className={adminTableHeadCell}>Published</th>
                <th className={adminTableHeadCell} />
              </tr>
            </thead>
            <AdminSortableBody
              itemIds={reorder.itemIds}
              className="divide-y divide-[var(--admin-border)]"
            >
              {pagination.pageRows.map((row) => (
                <AdminSortableTr
                  key={row.id}
                  id={row.id}
                  canReorder={reorder.canReorder}
                  showHandle={canMutate}
                  selected={selection.isSelected(row.id)}
                  dragLabel={row.name}
                >
                  {canMutate ? (
                    <td className={adminTableCell}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.name}`}
                        checked={selection.isSelected(row.id)}
                        onChange={() => selection.toggle(row.id)}
                      />
                    </td>
                  ) : null}
                  <td className={adminTableCell}>{row.name}</td>
                  <td className={adminTableCell}>{row.status}</td>
                  <td className={adminTableCell}>{row.published ? "Yes" : "No"}</td>
                  <td className={adminTableCell}>
                    <div className="flex justify-end gap-1">
                      <button type="button" className={adminBtnGhost} onClick={() => setViewRow(row)}>
                        <Eye className="size-4" />
                      </button>
                      {canMutate ? (
                        <>
                          <button type="button" className={adminBtnGhost} onClick={() => openEdit(row)}>
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            className={adminBtnGhost}
                            onClick={() => setDeleteId(row.id)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </AdminSortableTr>
              ))}
              {pagination.pageRows.length === 0 ? (
                <tr>
                  <td className={adminTableCell} colSpan={colSpan}>
                    <p className="py-8 text-center text-[var(--admin-muted)]">
                      No testimonials match these filters.
                    </p>
                  </td>
                </tr>
              ) : null}
            </AdminSortableBody>
          </table>
        </AdminDndProvider>
        <AdminTablePagination {...pagination} onPageChange={pagination.setPage} />
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={draft && draft.created_at === draft.updated_at ? "New testimonial" : "Edit testimonial"}
        onSave={() => void save()}
        saving={saving}
        side="right"
      >
        {draft ? (
          <div className="space-y-4">
            <div>
              <label className={adminLabel}>Quote</label>
              <textarea
                className={adminTextarea}
                value={draft.quote}
                onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={adminLabel}>Name</label>
                <input
                  className={adminInput}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div>
                <label className={adminLabel}>Role</label>
                <input
                  className={adminInput}
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={adminLabel}>Status</label>
              <AdminSelect
                value={draft.status}
                onChange={(status) => setDraft({ ...draft, status })}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
            </div>
            <ImageUploadField
              value={draft.image}
              onChange={(image) => setDraft({ ...draft, image })}
              folder="testimonials"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
            {saveErr ? <p className="text-sm text-red-600">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete testimonial"
        description="This cannot be undone."
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
        saveVariant="danger"
        side="bottom"
      />

      <AdminModal
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected testimonials"
        description={`Permanently delete ${selection.selectedCount} testimonial${selection.selectedCount === 1 ? "" : "s"}? This cannot be undone.`}
        onSave={() => void confirmBulkDelete()}
        saveLabel={`Delete ${selection.selectedCount}`}
        saveVariant="danger"
        side="bottom"
        saving={bulkBusy}
      />

      <EntityDetailSheet
        open={Boolean(viewRow)}
        onOpenChange={() => setViewRow(null)}
        title={viewRow?.name ?? "Testimonial"}
      >
        {viewRow ? <p className="text-sm italic">&ldquo;{viewRow.quote}&rdquo;</p> : null}
      </EntityDetailSheet>
    </div>
  );
}
