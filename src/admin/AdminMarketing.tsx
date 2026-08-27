import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/database.types";
import { useCms } from "@/contexts/CmsContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { AdminFilters } from "@/admin/components/AdminFilters";
import { AdminBulkBar } from "@/admin/components/AdminBulkBar";
import { AdminRichTextField } from "@/admin/components/AdminRichTextField";
import { useAdminTablePagination, validateSlug } from "@/admin/useAdminTablePagination";
import { useAdminSelection } from "@/admin/useAdminSelection";
import { matchesQuery, useAdminFilters, type AdminFilterDef } from "@/admin/useAdminFilters";
import { getMarketingCatalog } from "@/lib/cms/marketingCatalog";
import { parsePageSeo } from "@/lib/cms/pageSeo";
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

type Row = Tables<"marketing_pages">;

type ContentFields = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  body_html: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const MARKETING_FILTERS: AdminFilterDef[] = [
  {
    key: "published",
    label: "Status",
    options: [
      { value: "yes", label: "Published" },
      { value: "no", label: "Draft" },
    ],
  },
];

function emptyContentFields(): ContentFields {
  return {
    eyebrow: "",
    titleLine1: "",
    titleLine2: "",
    description: "",
    body_html: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function readContentFields(content: Json | null): { fields: ContentFields; base: Record<string, unknown> } {
  const base = asRecord(content);
  const title = Array.isArray(base.title)
    ? base.title.filter((line): line is string => typeof line === "string")
    : [];
  const seo = parsePageSeo(base.seo, { title: "", description: "", keywords: [] });

  return {
    base,
    fields: {
      eyebrow: typeof base.eyebrow === "string" ? base.eyebrow : "",
      titleLine1: title[0] ?? "",
      titleLine2: title[1] ?? "",
      description: typeof base.description === "string" ? base.description : "",
      body_html: typeof base.body_html === "string" ? base.body_html : "",
      seoTitle: seo.title,
      seoDescription: seo.description,
      seoKeywords: seo.keywords.join(", "),
    },
  };
}

function mergeContentFields(base: Record<string, unknown>, fields: ContentFields): Json {
  const title = [fields.titleLine1.trim(), fields.titleLine2.trim()].filter(Boolean);
  const keywords = fields.seoKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return {
    ...base,
    eyebrow: fields.eyebrow.trim(),
    title,
    description: fields.description.trim(),
    body_html: fields.body_html,
    seo: {
      title: fields.seoTitle.trim(),
      description: fields.seoDescription.trim(),
      keywords,
    },
  } as Json;
}

function emptyPage(): Row {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    content: {},
    published: false,
    created_at: now,
    updated_at: now,
  };
}

export function AdminMarketing() {
  const { refetch } = useCms();
  const { role } = useAdminAuth();
  const canMutate = role !== "viewer";

  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Row | null>(null);
  const [contentBase, setContentBase] = useState<Record<string, unknown>>({});
  const [contentFields, setContentFields] = useState<ContentFields>(emptyContentFields());
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [alignOpen, setAlignOpen] = useState(false);
  const [alignBusy, setAlignBusy] = useState(false);

  const filterState = useAdminFilters(MARKETING_FILTERS);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (!matchesQuery(`${row.title} ${row.slug}`, filterState.query)) return false;
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
    const { data, error } = await sb.from("marketing_pages").select("*").order("slug");
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

  const openCreate = () => {
    setDraft(emptyPage());
    setContentBase({});
    setContentFields(emptyContentFields());
    setSaveErr(null);
    setModalOpen(true);
  };

  const openEdit = (row: Row) => {
    const parsed = readContentFields(row.content);
    setDraft({ ...row });
    setContentBase(parsed.base);
    setContentFields(parsed.fields);
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

    const content = mergeContentFields(contentBase, contentFields);
    const sb = getSupabase();
    if (!sb) return;

    setSaving(true);
    setSaveErr(null);

    const { error } = await sb.from("marketing_pages").upsert(
      { ...draft, content, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );

    setSaving(false);
    if (error) {
      setSaveErr(error.message);
      return;
    }

    setModalOpen(false);
    await refresh();
    await refetch();
  };

  const confirmDelete = async () => {
    if (!deleteId || !canMutate) return;
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from("marketing_pages").delete().eq("id", deleteId);
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
      .from("marketing_pages")
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
    const { error } = await sb.from("marketing_pages").delete().in("id", selection.selectedList);
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

  const confirmAlignFromLiveCopy = async () => {
    if (!canMutate) return;
    const sb = getSupabase();
    if (!sb) return;

    setAlignBusy(true);
    setErr(null);

    const { data: existing, error: readErr } = await sb
      .from("marketing_pages")
      .select("slug");
    if (readErr) {
      setAlignBusy(false);
      setErr(readErr.message);
      return;
    }

    const slugs = new Set((existing ?? []).map((row) => row.slug));
    if (slugs.has("new-home") && !slugs.has("home")) {
      const { error: renameErr } = await sb
        .from("marketing_pages")
        .update({ slug: "home", title: "Home", updated_at: new Date().toISOString() })
        .eq("slug", "new-home");
      if (renameErr) {
        setAlignBusy(false);
        setErr(renameErr.message);
        return;
      }
    }

    const catalog = getMarketingCatalog();
    const { error: upsertErr } = await sb.from("marketing_pages").upsert(
      catalog.map((entry) => ({
        slug: entry.slug,
        title: entry.title,
        content: entry.content as Json,
        published: true,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "slug" },
    );

    if (upsertErr) {
      setAlignBusy(false);
      setErr(upsertErr.message);
      return;
    }

    await sb.from("marketing_pages").delete().eq("slug", "new-home");

    setAlignBusy(false);
    setAlignOpen(false);
    await refresh();
    await refetch();
  };

  return (
    <div>
      <AdminPageHeading
        title="Marketing pages"
        description="SEO for every public page lives here. Page copy is taken from the live site — align these records from that copy rather than pushing old marketing seed onto the pages."
        actions={
          canMutate ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" className={adminBtnGhost} onClick={() => setAlignOpen(true)}>
                <RefreshCw className="size-4" />
                Align with live copy
              </button>
              <button type="button" className={adminBtnPrimary} onClick={openCreate}>
                <Plus className="size-4" />
                Add page
              </button>
            </div>
          ) : null
        }
      />

      {err ? <p className="mb-4 text-sm text-red-600">{err}</p> : null}

      <div className={adminTableWrap}>
        <AdminFilters
          query={filterState.query}
          onQueryChange={filterState.setQuery}
          queryPlaceholder="Search title, slug…"
          filterDefs={MARKETING_FILTERS}
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

        <table className={adminTable}>
          <thead>
            <tr>
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
              <th className={adminTableHeadCell}>Published</th>
              <th className={adminTableHeadCell} />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {pagination.pageRows.map((row) => (
              <tr
                key={row.id}
                className={
                  selection.isSelected(row.id)
                    ? "bg-[color-mix(in_srgb,var(--admin-primary)_6%,white)]"
                    : undefined
                }
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
                <td className={adminTableCell}>{row.published ? "Yes" : "No"}</td>
                <td className={adminTableCell}>
                  <div className="flex justify-end gap-1">
                    {canMutate ? (
                      <>
                        <button type="button" className={adminBtnGhost} onClick={() => openEdit(row)}>
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
            {pagination.pageRows.length === 0 ? (
              <tr>
                <td className={adminTableCell} colSpan={canMutate ? 5 : 4}>
                  <p className="py-8 text-center text-[var(--admin-muted)]">No pages match these filters.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <AdminTablePagination {...pagination} onPageChange={pagination.setPage} />
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Marketing page"
        onSave={() => void save()}
        saving={saving}
        wide
        side="right"
      >
        {draft ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={adminLabel}>Title (admin list)</label>
                <input
                  className={adminInput}
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  disabled={!canMutate}
                />
              </div>
              <div>
                <label className={adminLabel}>Slug</label>
                <input
                  className={adminInput}
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  disabled={!canMutate}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                disabled={!canMutate}
              />
              Published
            </label>

            <div className="border-t border-[var(--admin-border)] pt-4">
              <p className="mb-1 font-detective text-[18px] font-bold uppercase text-[var(--admin-ink)]">
                SEO
              </p>
              <p className="mb-3 text-sm text-[var(--admin-muted)]">
                Title, description, and keywords used in the page head. This is the per-page SEO editor.
              </p>

              <div className="space-y-4">
                <div>
                  <label className={adminLabel}>SEO title</label>
                  <input
                    className={adminInput}
                    value={contentFields.seoTitle}
                    onChange={(e) =>
                      setContentFields({ ...contentFields, seoTitle: e.target.value })
                    }
                    disabled={!canMutate}
                    placeholder="Page title in Google"
                  />
                </div>
                <div>
                  <label className={adminLabel}>SEO description</label>
                  <textarea
                    className={adminTextarea}
                    value={contentFields.seoDescription}
                    onChange={(e) =>
                      setContentFields({ ...contentFields, seoDescription: e.target.value })
                    }
                    disabled={!canMutate}
                    rows={3}
                  />
                </div>
                <div>
                  <label className={adminLabel}>Keywords</label>
                  <textarea
                    className={adminTextarea}
                    value={contentFields.seoKeywords}
                    onChange={(e) =>
                      setContentFields({ ...contentFields, seoKeywords: e.target.value })
                    }
                    disabled={!canMutate}
                    rows={3}
                    placeholder="Comma-separated"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--admin-border)] pt-4">
              <p className="mb-1 font-detective text-[18px] font-bold uppercase text-[var(--admin-ink)]">
                Page content
              </p>
              <p className="mb-3 text-sm text-[var(--admin-muted)]">
                Snapshot of the live page copy. Visible pages keep the edited site text; use Align to refresh these fields. SEO above is what publishes in the page head.
              </p>

              <div className="space-y-4">
                <div>
                  <label className={adminLabel}>Eyebrow</label>
                  <input
                    className={adminInput}
                    value={contentFields.eyebrow}
                    onChange={(e) => setContentFields({ ...contentFields, eyebrow: e.target.value })}
                    disabled={!canMutate}
                    placeholder="Legal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={adminLabel}>Title line 1</label>
                    <input
                      className={adminInput}
                      value={contentFields.titleLine1}
                      onChange={(e) => setContentFields({ ...contentFields, titleLine1: e.target.value })}
                      disabled={!canMutate}
                      placeholder="Privacy"
                    />
                  </div>
                  <div>
                    <label className={adminLabel}>Title line 2</label>
                    <input
                      className={adminInput}
                      value={contentFields.titleLine2}
                      onChange={(e) => setContentFields({ ...contentFields, titleLine2: e.target.value })}
                      disabled={!canMutate}
                      placeholder="Policy"
                    />
                  </div>
                </div>

                <div>
                  <label className={adminLabel}>Description</label>
                  <textarea
                    className={adminTextarea}
                    value={contentFields.description}
                    onChange={(e) => setContentFields({ ...contentFields, description: e.target.value })}
                    disabled={!canMutate}
                    rows={3}
                  />
                </div>

                <div>
                  <label className={adminLabel}>Body (WYSIWYG)</label>
                  <AdminRichTextField
                    value={contentFields.body_html}
                    onChange={(html) => setContentFields({ ...contentFields, body_html: html })}
                    disabled={!canMutate}
                    placeholder="Write page content…"
                    minHeightClass="[&_.ProseMirror]:min-h-[280px]"
                  />
                </div>
              </div>
            </div>

            {saveErr ? <p className="text-sm text-red-600">{saveErr}</p> : null}
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={Boolean(deleteId)}
        onOpenChange={() => setDeleteId(null)}
        title="Delete page"
        description="This cannot be undone."
        onSave={() => void confirmDelete()}
        saveLabel="Delete"
        saveVariant="danger"
        side="bottom"
      />

      <AdminModal
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected pages"
        description={`Permanently delete ${selection.selectedCount} page${selection.selectedCount === 1 ? "" : "s"}? This cannot be undone.`}
        onSave={() => void confirmBulkDelete()}
        saveLabel={`Delete ${selection.selectedCount}`}
        saveVariant="danger"
        side="bottom"
        saving={bulkBusy}
      />

      <AdminModal
        open={alignOpen}
        onOpenChange={setAlignOpen}
        title="Align with live page copy"
        description="Replace marketing records with the copy currently on the site. Adds missing pages, renames New home to Home, and fills SEO from the live pages. Existing SEO edits will be overwritten."
        onSave={() => void confirmAlignFromLiveCopy()}
        saveLabel="Align now"
        side="bottom"
        saving={alignBusy}
      />
    </div>
  );
}
