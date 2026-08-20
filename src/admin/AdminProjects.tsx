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
import { ImageGalleryField } from "@/admin/components/ImageGalleryField";
import { useAdminTablePagination, validateSlug } from "@/admin/useAdminTablePagination";
import { useAdminSelection } from "@/admin/useAdminSelection";
import { useAdminReorder } from "@/admin/useAdminReorder";
import { matchesQuery, useAdminFilters, type AdminFilterDef } from "@/admin/useAdminFilters";
import { AdminDndProvider, AdminSortableBody, AdminSortableTr } from "@/admin/components/AdminSortable";
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
  adminTextarea,
} from "@/admin/adminClassNames";

type Row = Tables<"projects">;

const PROJECT_FILTERS: AdminFilterDef[] = [
  {
    key: "published",
    label: "Status",
    options: [
      { value: "yes", label: "Published" },
      { value: "no", label: "Draft" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: [
      { value: "Residential", label: "Residential" },
      { value: "Hospitality", label: "Hospitality" },
      { value: "Commercial", label: "Commercial" },
    ],
  },
  {
    key: "featured",
    label: "Featured",
    options: [
      { value: "yes", label: "Featured" },
      { value: "no", label: "Not featured" },
    ],
  },
];

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.filter((v): v is string => typeof v === "string").join("\n");
}

const SERVICE_OPTIONS = [
  { value: "interior-design", label: "Interior Design" },
  { value: "branding", label: "Branding" },
  { value: "design-management", label: "Design Management" },
  { value: "design-strategy", label: "Design Strategy" },
] as const;

type ServiceSlug = (typeof SERVICE_OPTIONS)[number]["value"];

function asServiceList(value: unknown): ServiceSlug[] {
  if (!Array.isArray(value)) return ["interior-design"];
  const allowed = new Set<string>(SERVICE_OPTIONS.map((o) => o.value));
  const next = value.filter(
    (v): v is ServiceSlug => typeof v === "string" && allowed.has(v),
  );
  return next.length > 0 ? next : ["interior-design"];
}

function emptyProject(): Row {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    location: "",
    price: "",
    category: "Residential",
    year: "",
    client: "",
    area: "",
    status: "",
    duration: "",
    typologies: [],
    scope: [],
    materials: [],
    finishes: [],
    credits: [],
    challenge: "",
    approach: "",
    outcome: "",
    excerpt: "",
    body: [],
    hero: "",
    gallery: [],
    span: "short",
    services: ["interior-design"],
    featured: false,
    sort_order: 0,
    published: false,
    created_at: now,
    updated_at: now,
  };
}

export function AdminProjects() {
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

  const filterState = useAdminFilters(PROJECT_FILTERS);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (!matchesQuery(`${row.title} ${row.slug} ${row.location}`, filterState.query)) {
        return false;
      }
      if (filterState.filters.published === "yes" && !row.published) return false;
      if (filterState.filters.published === "no" && row.published) return false;
      if (
        filterState.filters.category !== "all" &&
        row.category !== filterState.filters.category
      ) {
        return false;
      }
      if (filterState.filters.featured === "yes" && !row.featured) return false;
      if (filterState.filters.featured === "no" && row.featured) return false;
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
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setErr(error.message);
    else {
      setErr(null);
      setRows(data ?? []);
    }
  }, []);

  const reorder = useAdminReorder({
    table: "projects",
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
    setDraft(emptyProject());
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
    const slugErr = validateSlug(draft.slug);
    if (slugErr) {
      setSaveErr(slugErr);
      return;
    }
    if (!draft.title.trim()) {
      setSaveErr("Title is required.");
      return;
    }

    const sb = getSupabase();
    if (!sb) return;

    setSaving(true);
    setSaveErr(null);
    const payload = {
      ...draft,
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from("projects").upsert(payload, { onConflict: "id" });
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
    const { error } = await sb.from("projects").delete().eq("id", deleteId);
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
      .from("projects")
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
    const { error } = await sb.from("projects").delete().in("id", selection.selectedList);
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
        title="Projects"
        description="Portfolio case studies shown on the public site. Drag rows to set display order."
        actions={
          canMutate ? (
            <button type="button" className={adminBtnPrimary} onClick={openCreate}>
              <Plus className="size-4" />
              Add project
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
          queryPlaceholder="Search title, slug, location…"
          filterDefs={PROJECT_FILTERS}
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
                <th className={adminTableHeadCell}>Title</th>
                <th className={adminTableHeadCell}>Slug</th>
                <th className={adminTableHeadCell}>Category</th>
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
                  dragLabel={row.title}
                >
                  {canMutate ? (
                    <td className={adminTableCell}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.title}`}
                        checked={selection.isSelected(row.id)}
                        onChange={() => selection.toggle(row.id)}
                      />
                    </td>
                  ) : null}
                  <td className={adminTableCell}>{row.title}</td>
                  <td className={adminTableCell}>{row.slug}</td>
                  <td className={adminTableCell}>{row.category}</td>
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
                  <td className={adminTableCell} colSpan={canMutate ? 7 : 5}>
                    <p className="py-8 text-center text-[var(--admin-muted)]">No projects match these filters.</p>
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
        title={draft && draft.created_at === draft.updated_at ? "New project" : "Edit project"}
        onSave={() => void save()}
        saving={saving}
        wide
        side="right"
      >
        {draft ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={adminLabel}>Title</label>
              <input
                className={adminInput}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Slug</label>
              <input
                className={adminInput}
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Category</label>
              <select
                className={adminSelect}
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              >
                <option value="Residential">Residential</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className={adminLabel}>Span</label>
              <select
                className={adminSelect}
                value={draft.span}
                onChange={(e) => setDraft({ ...draft, span: e.target.value })}
              >
                <option value="short">Short</option>
                <option value="tall">Tall</option>
                <option value="wide">Wide</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={adminLabel}>Services</label>
              <div className="mt-1 flex flex-wrap gap-3">
                {SERVICE_OPTIONS.map((option) => {
                  const selected = asServiceList(draft.services);
                  const checked = selected.includes(option.value);
                  return (
                    <label key={option.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? selected.filter((slug) => slug !== option.value)
                            : [...selected, option.value];
                          setDraft({
                            ...draft,
                            services: next.length > 0 ? next : ["interior-design"],
                          });
                        }}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label className={adminLabel}>Location</label>
              <input
                className={adminInput}
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
            <div>
              <label className={adminLabel}>Year</label>
              <input
                className={adminInput}
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className={adminLabel}>Excerpt</label>
              <textarea
                className={adminTextarea}
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                label="Hero image"
                value={draft.hero}
                onChange={(hero) => setDraft({ ...draft, hero })}
                folder="projects"
              />
            </div>
            <div className="md:col-span-2">
              <ImageGalleryField
                label="Gallery"
                value={draft.gallery}
                onChange={(gallery) => setDraft({ ...draft, gallery })}
                folder="projects"
              />
            </div>
            <div className="md:col-span-2">
              <label className={adminLabel}>Body paragraphs (one per line)</label>
              <textarea
                className={adminTextarea}
                value={arrayToLines(draft.body)}
                onChange={(e) => setDraft({ ...draft, body: linesToArray(e.target.value) })}
              />
            </div>
            <div>
              <label className={adminLabel}>Sort order</label>
              <input
                type="number"
                className={adminInput}
                value={draft.sort_order}
                onChange={(e) =>
                  setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                />
                Featured
              </label>
            </div>
            {saveErr ? <p className="md:col-span-2 text-sm text-red-600">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete project"
        description="This cannot be undone."
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
        saveVariant="danger"
        side="bottom"
      />

      <AdminModal
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected projects"
        description={`Permanently delete ${selection.selectedCount} project${selection.selectedCount === 1 ? "" : "s"}? This cannot be undone.`}
        onSave={() => void confirmBulkDelete()}
        saveLabel={`Delete ${selection.selectedCount}`}
        saveVariant="danger"
        side="bottom"
        saving={bulkBusy}
      />

      <EntityDetailSheet
        open={Boolean(viewRow)}
        onOpenChange={() => setViewRow(null)}
        title={viewRow?.title ?? "Project"}
      >
        {viewRow ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-[var(--admin-muted)]">Slug</dt>
              <dd>{viewRow.slug}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-[var(--admin-muted)]">Excerpt</dt>
              <dd>{viewRow.excerpt}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-[var(--admin-muted)]">Location</dt>
              <dd>{viewRow.location}</dd>
            </div>
          </dl>
        ) : null}
      </EntityDetailSheet>
    </div>
  );
}
