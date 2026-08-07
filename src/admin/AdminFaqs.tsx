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

import { AdminRichTextField } from "@/admin/components/AdminRichTextField";

import { useAdminTablePagination, validateSlug } from "@/admin/useAdminTablePagination";

import { useAdminSelection } from "@/admin/useAdminSelection";

import { matchesQuery, useAdminFilters, type AdminFilterDef } from "@/admin/useAdminFilters";

import { useAdminReorder } from "@/admin/useAdminReorder";

import { AdminDndProvider, AdminSortableBody, AdminSortableTr } from "@/admin/components/AdminSortable";

import {

  adminBtnGhost,

  adminBtnPrimary,

  adminInput,

  adminLabel,

  adminSectionTitle,

  adminSelect,

  adminTable,

  adminTableCell,

  adminTableHeadCell,

  adminTableWrap,

  adminTextarea,

} from "@/admin/adminClassNames";



type TopicRow = Tables<"faq_topics">;

type EntryRow = Tables<"faq_entries">;



function emptyTopic(): TopicRow {

  const now = new Date().toISOString();

  return {

    id: crypto.randomUUID(),

    slug: "",

    label: "",

    sort_order: 0,

    published: true,

    created_at: now,

    updated_at: now,

  };

}



function emptyEntry(topicId: string): EntryRow {

  const now = new Date().toISOString();

  return {

    id: crypto.randomUUID(),

    topic_id: topicId,

    question: "",

    answer: "",

    answer_html: "",

    link_label: null,

    link_to: null,

    sort_order: 0,

    published: true,

    created_at: now,

    updated_at: now,

  };

}



export function AdminFaqs() {

  const { refetch } = useCms();

  const { role } = useAdminAuth();

  const canMutate = role !== "viewer";



  const [topics, setTopics] = useState<TopicRow[]>([]);

  const [entries, setEntries] = useState<EntryRow[]>([]);

  const [err, setErr] = useState<string | null>(null);



  const [topicModal, setTopicModal] = useState(false);

  const [topicDraft, setTopicDraft] = useState<TopicRow | null>(null);

  const [entryModal, setEntryModal] = useState(false);

  const [entryDraft, setEntryDraft] = useState<EntryRow | null>(null);

  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);

  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  const [bulkDeleteTopicsOpen, setBulkDeleteTopicsOpen] = useState(false);

  const [bulkDeleteEntriesOpen, setBulkDeleteEntriesOpen] = useState(false);

  const [bulkBusy, setBulkBusy] = useState(false);

  const [viewEntry, setViewEntry] = useState<EntryRow | null>(null);



  const entryFilterDefs = useMemo<AdminFilterDef[]>(

    () => [

      {

        key: "topic",

        label: "Topic",

        options: topics.map((t) => ({ value: t.id, label: t.label })),

      },

    ],

    [topics],

  );



  const topicFilterState = useAdminFilters([]);

  const entryFilterState = useAdminFilters(entryFilterDefs);



  const filteredTopics = useMemo(() => {

    return topics.filter((row) =>

      matchesQuery(`${row.label} ${row.slug}`, topicFilterState.query),

    );

  }, [topics, topicFilterState.query]);



  const filteredEntries = useMemo(() => {

    return entries.filter((row) => {

      if (!matchesQuery(`${row.question} ${row.answer}`, entryFilterState.query)) {

        return false;

      }

      if (

        entryFilterState.filters.topic !== "all" &&

        row.topic_id !== entryFilterState.filters.topic

      ) {

        return false;

      }

      return true;

    });

  }, [entries, entryFilterState.query, entryFilterState.filters]);



  const topicPagination = useAdminTablePagination(filteredTopics);

  const entryPagination = useAdminTablePagination(filteredEntries);

  const topicSelection = useAdminSelection(filteredTopics);

  const entrySelection = useAdminSelection(filteredEntries);

  const topicPageIds = topicPagination.pageRows.map((r) => r.id);

  const entryPageIds = entryPagination.pageRows.map((r) => r.id);



  const refresh = useCallback(async () => {

    const sb = getSupabase();

    if (!sb) return;

    const [topicsRes, entriesRes] = await Promise.all([

      sb.from("faq_topics").select("*").order("sort_order", { ascending: true }),

      sb.from("faq_entries").select("*").order("sort_order", { ascending: true }),

    ]);

    if (topicsRes.error || entriesRes.error) {

      setErr(topicsRes.error?.message ?? entriesRes.error?.message ?? "Load failed");

    } else {

      setErr(null);

      setTopics(topicsRes.data ?? []);

      setEntries(entriesRes.data ?? []);

    }

  }, []);



  useEffect(() => {

    void refresh();

  }, [refresh]);



  useEffect(() => {

    topicPagination.resetPage();

  }, [topicFilterState.query, topicPagination.resetPage]);



  useEffect(() => {

    entryPagination.resetPage();

  }, [entryFilterState.query, entryFilterState.filters, entryPagination.resetPage]);



  const topicReorder = useAdminReorder({

    table: "faq_topics",

    rows: topics,

    setRows: setTopics,

    pageRows: topicPagination.pageRows,

    page: topicPagination.page,

    pageSize: topicPagination.pageSize,

    canMutate,

    filtersActive: topicFilterState.activeCount > 0,

    onError: setErr,

    onPersisted: () => refetch(),

    refresh,

  });



  const entryReorder = useAdminReorder({

    table: "faq_entries",

    rows: entries,

    setRows: setEntries,

    pageRows: entryPagination.pageRows,

    page: entryPagination.page,

    pageSize: entryPagination.pageSize,

    canMutate,

    filtersActive: entryFilterState.activeCount > 0,

    onError: setErr,

    onPersisted: () => refetch(),

    refresh,

  });



  const saveTopic = async () => {

    if (!topicDraft || !canMutate) return;

    const slugErr = validateSlug(topicDraft.slug);

    if (slugErr) {

      setSaveErr(slugErr);

      return;

    }

    if (!topicDraft.label.trim()) {

      setSaveErr("Label is required.");

      return;

    }

    const sb = getSupabase();

    if (!sb) return;

    setSaving(true);

    const { error } = await sb.from("faq_topics").upsert(

      { ...topicDraft, updated_at: new Date().toISOString() },

      { onConflict: "id" },

    );

    setSaving(false);

    if (error) {

      setSaveErr(error.message);

      return;

    }

    setTopicModal(false);

    setTopicDraft(null);

    await refresh();

    await refetch();

  };



  const saveEntry = async () => {

    if (!entryDraft || !canMutate) return;

    if (!entryDraft.question.trim() || !entryDraft.answer.trim()) {

      setSaveErr("Question and answer are required.");

      return;

    }

    const sb = getSupabase();

    if (!sb) return;

    setSaving(true);

    const { error } = await sb.from("faq_entries").upsert(

      { ...entryDraft, updated_at: new Date().toISOString() },

      { onConflict: "id" },

    );

    setSaving(false);

    if (error) {

      setSaveErr(error.message);

      return;

    }

    setEntryModal(false);

    setEntryDraft(null);

    await refresh();

    await refetch();

  };



  const confirmBulkDeleteTopics = async () => {

    if (!canMutate || topicSelection.selectedCount === 0) return;

    const sb = getSupabase();

    if (!sb) return;

    setBulkBusy(true);

    const { error } = await sb.from("faq_topics").delete().in("id", topicSelection.selectedList);

    setBulkBusy(false);

    if (error) {

      setErr(error.message);

      return;

    }

    setBulkDeleteTopicsOpen(false);

    topicSelection.clear();

    await refresh();

    await refetch();

  };



  const confirmBulkDeleteEntries = async () => {

    if (!canMutate || entrySelection.selectedCount === 0) return;

    const sb = getSupabase();

    if (!sb) return;

    setBulkBusy(true);

    const { error } = await sb.from("faq_entries").delete().in("id", entrySelection.selectedList);

    setBulkBusy(false);

    if (error) {

      setErr(error.message);

      return;

    }

    setBulkDeleteEntriesOpen(false);

    entrySelection.clear();

    await refresh();

    await refetch();

  };



  return (

    <div className="space-y-10">

      <AdminPageHeading

        title="FAQs"

        description="Help center topics and Q&A entries. Drag rows to set display order when filters are cleared."

      />



      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      {topicReorder.reordering || entryReorder.reordering ? (

        <p className="text-sm text-[var(--admin-muted)]">Saving order…</p>

      ) : null}



      <section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <h2 className={adminSectionTitle}>Topics</h2>

          {canMutate ? (

            <button

              type="button"

              className={adminBtnPrimary}

              onClick={() => {

                setTopicDraft(emptyTopic());

                setSaveErr(null);

                setTopicModal(true);

              }}

            >

              <Plus className="size-4" />

              Add topic

            </button>

          ) : null}

        </div>

        <div className={adminTableWrap}>

          <AdminFilters

            query={topicFilterState.query}

            onQueryChange={topicFilterState.setQuery}

            queryPlaceholder="Search label, slug…"

            onReset={topicFilterState.reset}

            activeCount={topicFilterState.activeCount}

            trailing={

              <p className="text-sm text-[var(--admin-muted)] md:ml-auto">

                {filteredTopics.length} of {topics.length}

              </p>

            }

          />



          {canMutate ? (

            <AdminBulkBar

              count={topicSelection.selectedCount}

              onClear={topicSelection.clear}

              busy={bulkBusy}

              onDelete={() => setBulkDeleteTopicsOpen(true)}

            />

          ) : null}



          <AdminDndProvider

            sensors={topicReorder.sensors}

            collisionDetection={topicReorder.collisionDetection}

            onDragEnd={topicReorder.onDragEnd}

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

                        aria-label="Select all topics on page"

                        checked={topicSelection.pageAllSelected(topicPageIds)}

                        ref={(el) => {

                          if (el) el.indeterminate = topicSelection.pageSomeSelected(topicPageIds);

                        }}

                        onChange={() => topicSelection.toggleAll(topicPageIds)}

                      />

                    </th>

                  ) : null}

                  <th className={adminTableHeadCell}>Label</th>

                  <th className={adminTableHeadCell}>Slug</th>

                  <th className={adminTableHeadCell} />

                </tr>

              </thead>

              <AdminSortableBody itemIds={topicReorder.itemIds} className="divide-y divide-[var(--admin-border)]">

                {topicPagination.pageRows.map((row) => (

                  <AdminSortableTr

                    key={row.id}

                    id={row.id}

                    canReorder={topicReorder.canReorder}

                    showHandle={canMutate}

                    selected={topicSelection.isSelected(row.id)}

                    dragLabel={row.label}

                  >

                    {canMutate ? (

                      <td className={adminTableCell}>

                        <input

                          type="checkbox"

                          aria-label={`Select ${row.label}`}

                          checked={topicSelection.isSelected(row.id)}

                          onChange={() => topicSelection.toggle(row.id)}

                        />

                      </td>

                    ) : null}

                    <td className={adminTableCell}>{row.label}</td>

                    <td className={adminTableCell}>{row.slug}</td>

                    <td className={adminTableCell}>

                      <div className="flex justify-end gap-1">

                        {canMutate ? (

                          <>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => {

                                setTopicDraft({ ...row });

                                setTopicModal(true);

                              }}

                            >

                              <Pencil className="size-4" />

                            </button>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => setDeleteTopicId(row.id)}

                            >

                              <Trash2 className="size-4" />

                            </button>

                          </>

                        ) : null}

                      </div>

                    </td>

                  </AdminSortableTr>

                ))}

                {topicPagination.pageRows.length === 0 ? (

                  <tr>

                    <td className={adminTableCell} colSpan={canMutate ? 5 : 3}>

                      <p className="py-8 text-center text-[var(--admin-muted)]">

                        No topics match these filters.

                      </p>

                    </td>

                  </tr>

                ) : null}

              </AdminSortableBody>

            </table>

          </AdminDndProvider>

          <AdminTablePagination {...topicPagination} onPageChange={topicPagination.setPage} />

        </div>

      </section>



      <section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <h2 className={adminSectionTitle}>Entries</h2>

          {canMutate ? (

            <button

              type="button"

              className={adminBtnPrimary}

              disabled={topics.length === 0}

              onClick={() => {

                const topicId =

                  entryFilterState.filters.topic !== "all"

                    ? entryFilterState.filters.topic

                    : topics[0]?.id;

                if (!topicId) return;

                setEntryDraft(emptyEntry(topicId));

                setSaveErr(null);

                setEntryModal(true);

              }}

            >

              <Plus className="size-4" />

              Add entry

            </button>

          ) : null}

        </div>

        <div className={adminTableWrap}>

          <AdminFilters

            query={entryFilterState.query}

            onQueryChange={entryFilterState.setQuery}

            queryPlaceholder="Search question, answer…"

            filterDefs={entryFilterDefs}

            filters={entryFilterState.filters}

            onFilterChange={entryFilterState.setFilter}

            onReset={entryFilterState.reset}

            activeCount={entryFilterState.activeCount}

            trailing={

              <p className="text-sm text-[var(--admin-muted)] md:ml-auto">

                {filteredEntries.length} of {entries.length}

              </p>

            }

          />



          {canMutate ? (

            <AdminBulkBar

              count={entrySelection.selectedCount}

              onClear={entrySelection.clear}

              busy={bulkBusy}

              onDelete={() => setBulkDeleteEntriesOpen(true)}

            />

          ) : null}



          <AdminDndProvider

            sensors={entryReorder.sensors}

            collisionDetection={entryReorder.collisionDetection}

            onDragEnd={entryReorder.onDragEnd}

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

                        aria-label="Select all entries on page"

                        checked={entrySelection.pageAllSelected(entryPageIds)}

                        ref={(el) => {

                          if (el) el.indeterminate = entrySelection.pageSomeSelected(entryPageIds);

                        }}

                        onChange={() => entrySelection.toggleAll(entryPageIds)}

                      />

                    </th>

                  ) : null}

                  <th className={adminTableHeadCell}>Question</th>

                  <th className={adminTableHeadCell}>Topic</th>

                  <th className={adminTableHeadCell} />

                </tr>

              </thead>

              <AdminSortableBody itemIds={entryReorder.itemIds} className="divide-y divide-[var(--admin-border)]">

                {entryPagination.pageRows.map((row) => (

                  <AdminSortableTr

                    key={row.id}

                    id={row.id}

                    canReorder={entryReorder.canReorder}

                    showHandle={canMutate}

                    selected={entrySelection.isSelected(row.id)}

                    dragLabel={row.question}

                  >

                    {canMutate ? (

                      <td className={adminTableCell}>

                        <input

                          type="checkbox"

                          aria-label={`Select ${row.question}`}

                          checked={entrySelection.isSelected(row.id)}

                          onChange={() => entrySelection.toggle(row.id)}

                        />

                      </td>

                    ) : null}

                    <td className={adminTableCell}>{row.question}</td>

                    <td className={adminTableCell}>

                      {topics.find((t) => t.id === row.topic_id)?.label ?? "—"}

                    </td>

                    <td className={adminTableCell}>

                      <div className="flex justify-end gap-1">

                        <button type="button" className={adminBtnGhost} onClick={() => setViewEntry(row)}>

                          <Eye className="size-4" />

                        </button>

                        {canMutate ? (

                          <>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => {

                                setEntryDraft({ ...row });

                                setEntryModal(true);

                              }}

                            >

                              <Pencil className="size-4" />

                            </button>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => setDeleteEntryId(row.id)}

                            >

                              <Trash2 className="size-4" />

                            </button>

                          </>

                        ) : null}

                      </div>

                    </td>

                  </AdminSortableTr>

                ))}

                {entryPagination.pageRows.length === 0 ? (

                  <tr>

                    <td className={adminTableCell} colSpan={canMutate ? 5 : 3}>

                      <p className="py-8 text-center text-[var(--admin-muted)]">

                        No entries match these filters.

                      </p>

                    </td>

                  </tr>

                ) : null}

              </AdminSortableBody>

            </table>

          </AdminDndProvider>

          <AdminTablePagination {...entryPagination} onPageChange={entryPagination.setPage} />

        </div>

      </section>



      <AdminModal

        open={topicModal}

        onOpenChange={setTopicModal}

        title="FAQ topic"

        onSave={() => void saveTopic()}

        saving={saving}

        side="right"

      >

        {topicDraft ? (

          <div className="space-y-4">

            <div>

              <label className={adminLabel}>Label</label>

              <input

                className={adminInput}

                value={topicDraft.label}

                onChange={(e) => setTopicDraft({ ...topicDraft, label: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Slug</label>

              <input

                className={adminInput}

                value={topicDraft.slug}

                onChange={(e) => setTopicDraft({ ...topicDraft, slug: e.target.value })}

              />

            </div>

            {saveErr ? <p className="text-sm text-red-600">{saveErr}</p> : null}

          </div>

        ) : null}

      </AdminModal>



      <AdminModal

        open={entryModal}

        onOpenChange={setEntryModal}

        title="FAQ entry"

        onSave={() => void saveEntry()}

        saving={saving}

        wide

        side="right"

      >

        {entryDraft ? (

          <div className="space-y-4">

            <div>

              <label className={adminLabel}>Topic</label>

              <select

                className={adminSelect}

                value={entryDraft.topic_id}

                onChange={(e) => setEntryDraft({ ...entryDraft, topic_id: e.target.value })}

              >

                {topics.map((t) => (

                  <option key={t.id} value={t.id}>

                    {t.label}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className={adminLabel}>Question</label>

              <input

                className={adminInput}

                value={entryDraft.question}

                onChange={(e) => setEntryDraft({ ...entryDraft, question: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Answer</label>

              <textarea

                className={adminTextarea}

                value={entryDraft.answer}

                onChange={(e) => setEntryDraft({ ...entryDraft, answer: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Answer (HTML)</label>

              <AdminRichTextField

                value={entryDraft.answer_html ?? ""}

                onChange={(answer_html) => setEntryDraft({ ...entryDraft, answer_html })}

              />

            </div>

            {saveErr ? <p className="text-sm text-red-600">{saveErr}</p> : null}

          </div>

        ) : null}

      </AdminModal>



      <AdminModal

        open={Boolean(deleteTopicId)}

        onOpenChange={() => setDeleteTopicId(null)}

        title="Delete topic"

        description="This cannot be undone."

        onSave={async () => {

          if (!deleteTopicId || !canMutate) return;

          const sb = getSupabase();

          if (!sb) return;

          const { error } = await sb.from("faq_topics").delete().eq("id", deleteTopicId);

          if (error) setErr(error.message);

          else {

            setDeleteTopicId(null);

            await refresh();

            await refetch();

          }

        }}

        saveLabel="Delete"

        saveVariant="danger"

        side="bottom"

      />



      <AdminModal

        open={Boolean(deleteEntryId)}

        onOpenChange={() => setDeleteEntryId(null)}

        title="Delete entry"

        description="This cannot be undone."

        onSave={async () => {

          if (!deleteEntryId || !canMutate) return;

          const sb = getSupabase();

          if (!sb) return;

          const { error } = await sb.from("faq_entries").delete().eq("id", deleteEntryId);

          if (error) setErr(error.message);

          else {

            setDeleteEntryId(null);

            await refresh();

            await refetch();

          }

        }}

        saveLabel="Delete"

        saveVariant="danger"

        side="bottom"

      />



      <AdminModal

        open={bulkDeleteTopicsOpen}

        onOpenChange={setBulkDeleteTopicsOpen}

        title="Delete selected topics"

        description={`Permanently delete ${topicSelection.selectedCount} topic${topicSelection.selectedCount === 1 ? "" : "s"}? This cannot be undone.`}

        onSave={() => void confirmBulkDeleteTopics()}

        saveLabel={`Delete ${topicSelection.selectedCount}`}

        saveVariant="danger"

        side="bottom"

        saving={bulkBusy}

      />



      <AdminModal

        open={bulkDeleteEntriesOpen}

        onOpenChange={setBulkDeleteEntriesOpen}

        title="Delete selected entries"

        description={`Permanently delete ${entrySelection.selectedCount} entr${entrySelection.selectedCount === 1 ? "y" : "ies"}? This cannot be undone.`}

        onSave={() => void confirmBulkDeleteEntries()}

        saveLabel={`Delete ${entrySelection.selectedCount}`}

        saveVariant="danger"

        side="bottom"

        saving={bulkBusy}

      />



      <EntityDetailSheet

        open={Boolean(viewEntry)}

        onOpenChange={() => setViewEntry(null)}

        title={viewEntry?.question ?? "Entry"}

      >

        {viewEntry ? <p className="whitespace-pre-line text-sm">{viewEntry.answer}</p> : null}

      </EntityDetailSheet>

    </div>

  );

}


