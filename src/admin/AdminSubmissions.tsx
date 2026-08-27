import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/database.types";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AdminPageHeading } from "@/admin/components/AdminPageHeading";
import { AdminModal } from "@/admin/components/AdminModal";
import { AdminTablePagination } from "@/admin/components/AdminTablePagination";
import { AdminFilters } from "@/admin/components/AdminFilters";
import { AdminBulkBar } from "@/admin/components/AdminBulkBar";
import { EntityDetailSheet } from "@/admin/components/EntityDetailSheet";
import { AdminSelect } from "@/admin/components/AdminSelect";
import { useAdminTablePagination } from "@/admin/useAdminTablePagination";
import { useAdminSelection } from "@/admin/useAdminSelection";
import { matchesQuery, useAdminFilters, type AdminFilterDef } from "@/admin/useAdminFilters";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTableWrap,
} from "@/admin/adminClassNames";
import { cn } from "@/lib/utils";

type Row = Tables<"form_submissions">;

const SUBMISSION_FILTERS: AdminFilterDef[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "new", label: "New" },
      { value: "read", label: "Read" },
      { value: "archived", label: "Archived" },
    ],
  },
];

const PAYLOAD_LABELS: Record<string, string> = {
  name: "Name",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  message: "Message",
  interest: "Interest",
  projectType: "Project type",
  company: "Company",
  subject: "Subject",
};

const HIDDEN_PAYLOAD_KEYS = new Set(["phoneDial", "phoneCountry"]);

function humanizeKey(key: string): string {
  if (PAYLOAD_LABELS[key]) return PAYLOAD_LABELS[key];
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function payloadEntries(payload: Json): Array<{ key: string; label: string; value: string }> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [
      {
        key: "payload",
        label: "Details",
        value: payload == null ? "-" : String(payload),
      },
    ];
  }

  return Object.entries(payload as Record<string, unknown>)
    .filter(([key]) => !HIDDEN_PAYLOAD_KEYS.has(key))
    .map(([key, raw]) => {
      let value = "-";
      if (raw == null || raw === "") value = "-";
      else if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") {
        value = String(raw);
      } else {
        value = JSON.stringify(raw);
      }
      return { key, label: humanizeKey(key), value };
    });
}

function statusBadgeClass(status: string): string {
  if (status === "new") {
    return "border-transparent bg-emerald-500/15 text-emerald-700";
  }
  if (status === "read") {
    return "border-transparent bg-sky-500/15 text-sky-700";
  }
  if (status === "archived") {
    return "border-transparent bg-[var(--admin-bg)] text-[var(--admin-muted)]";
  }
  return "border-[var(--admin-border)] bg-white text-[var(--admin-ink)]";
}

function statusLabel(status: string): string {
  if (status === "new") return "New";
  if (status === "read") return "Read";
  if (status === "archived") return "Archived";
  return status;
}


function payloadToCsv(rows: Row[]): string {

  const headers = ["id", "form_name", "status", "created_at", "payload"];

  const lines = rows.map((row) =>

    [

      row.id,

      row.form_name,

      row.status,

      row.created_at,

      JSON.stringify(row.payload).replace(/"/g, '""'),

    ]

      .map((v) => `"${String(v)}"`)

      .join(","),

  );

  return [headers.join(","), ...lines].join("\n");

}



function payloadSearchText(payload: Json): string {

  try {

    return JSON.stringify(payload);

  } catch {

    return "";

  }

}



export function AdminSubmissions() {

  const { role } = useAdminAuth();

  const canMutate = role !== "viewer";



  const [rows, setRows] = useState<Row[]>([]);

  const [err, setErr] = useState<string | null>(null);

  const [viewRow, setViewRow] = useState<Row | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [bulkBusy, setBulkBusy] = useState(false);



  const filterState = useAdminFilters(SUBMISSION_FILTERS);



  const filteredRows = useMemo(() => {

    return rows.filter((row) => {

      const haystack = `${row.form_name} ${payloadSearchText(row.payload)}`;

      if (!matchesQuery(haystack, filterState.query)) return false;

      if (

        filterState.filters.status !== "all" &&

        row.status !== filterState.filters.status

      ) {

        return false;

      }

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

      .from("form_submissions")

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



  useEffect(() => {

    pagination.resetPage();

  }, [filterState.query, filterState.filters, pagination.resetPage]);



  const exportCsv = () => {

    const csv = payloadToCsv(filteredRows);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;

    a.click();

    URL.revokeObjectURL(url);

  };



  const updateStatus = async (id: string, status: string) => {

    if (!canMutate) return;

    const sb = getSupabase();

    if (!sb) return;

    const { error } = await sb

      .from("form_submissions")

      .update({ status, updated_at: new Date().toISOString() })

      .eq("id", id);

    if (error) {

      setErr(error.message);

      return;

    }

    await refresh();

    if (viewRow?.id === id) {

      setViewRow((prev) => (prev ? { ...prev, status } : null));

    }

  };



  const setStatusBulk = async (status: string) => {

    if (!canMutate || selection.selectedCount === 0) return;

    const sb = getSupabase();

    if (!sb) return;

    setBulkBusy(true);

    const { error } = await sb

      .from("form_submissions")

      .update({ status, updated_at: new Date().toISOString() })

      .in("id", selection.selectedList);

    setBulkBusy(false);

    if (error) {

      setErr(error.message);

      return;

    }

    selection.clear();

    await refresh();

  };



  const confirmDelete = async () => {

    if (!deleteId || !canMutate) return;

    const sb = getSupabase();

    if (!sb) return;

    const { error } = await sb.from("form_submissions").delete().eq("id", deleteId);

    if (error) setErr(error.message);

    else {

      setDeleteId(null);

      await refresh();

    }

  };



  const confirmBulkDelete = async () => {

    if (!canMutate || selection.selectedCount === 0) return;

    const sb = getSupabase();

    if (!sb) return;

    setBulkBusy(true);

    const { error } = await sb.from("form_submissions").delete().in("id", selection.selectedList);

    setBulkBusy(false);

    if (error) {

      setErr(error.message);

      return;

    }

    setBulkDeleteOpen(false);

    selection.clear();

    await refresh();

  };



  return (

    <div>

      <AdminPageHeading

        title="Form submissions"

        description="Inbound contact and inquiry messages."

        actions={

          <button type="button" className={adminBtnPrimary} onClick={exportCsv}>

            <Download className="size-4" />

            Export CSV

          </button>

        }

      />



      {err ? <p className="mb-4 text-sm text-red-600">{err}</p> : null}



      <div className={adminTableWrap}>

        <AdminFilters

          query={filterState.query}

          onQueryChange={filterState.setQuery}

          queryPlaceholder="Search form name or payload…"

          filterDefs={SUBMISSION_FILTERS}

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

            onMarkRead={() => void setStatusBulk("read")}

            onArchive={() => void setStatusBulk("archived")}

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

              <th className={adminTableHeadCell}>Form</th>

              <th className={adminTableHeadCell}>Status</th>

              <th className={adminTableHeadCell}>Received</th>

              <th className={adminTableHeadCell} />

            </tr>

          </thead>

          <tbody className="divide-y divide-[var(--admin-border)]">

            {pagination.pageRows.map((row) => (

              <tr

                key={row.id}

                className={cn(

                  "cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--admin-primary)_4%,white)]",

                  selection.isSelected(row.id)

                    ? "bg-[color-mix(in_srgb,var(--admin-primary)_6%,white)]"

                    : undefined,

                )}

                onClick={() => setViewRow(row)}

              >

                {canMutate ? (

                  <td className={adminTableCell} onClick={(e) => e.stopPropagation()}>

                    <input

                      type="checkbox"

                      aria-label={`Select ${row.form_name}`}

                      checked={selection.isSelected(row.id)}

                      onChange={() => selection.toggle(row.id)}

                    />

                  </td>

                ) : null}

                <td className={adminTableCell}>{row.form_name}</td>

                <td className={adminTableCell}>{row.status}</td>

                <td className={adminTableCell}>

                  {new Date(row.created_at).toLocaleString()}

                </td>

                <td className={adminTableCell} onClick={(e) => e.stopPropagation()}>

                  <div className="flex justify-end gap-1">

                    <button type="button" className={adminBtnGhost} onClick={() => setViewRow(row)}>

                      <Eye className="size-4" />

                    </button>

                    {canMutate ? (

                      <button type="button" className={adminBtnGhost} onClick={() => setDeleteId(row.id)}>

                        <Trash2 className="size-4" />

                      </button>

                    ) : null}

                  </div>

                </td>

              </tr>

            ))}

            {pagination.pageRows.length === 0 ? (

              <tr>

                <td className={adminTableCell} colSpan={canMutate ? 5 : 4}>

                  <p className="py-8 text-center text-[var(--admin-muted)]">

                    No submissions match these filters.

                  </p>

                </td>

              </tr>

            ) : null}

          </tbody>

        </table>

        <AdminTablePagination {...pagination} onPageChange={pagination.setPage} />

      </div>



      <EntityDetailSheet

        open={Boolean(viewRow)}

        onOpenChange={() => setViewRow(null)}

        title={viewRow?.form_name ?? "Submission"}

        description={viewRow ? new Date(viewRow.created_at).toLocaleString() : undefined}

      >

        {viewRow ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              {canMutate ? (
                <label className="inline-flex items-center gap-2">
                  <span className="sr-only">Status</span>
                  <AdminSelect
                    size="compact"
                    className="w-auto min-w-[8.5rem]"
                    aria-label="Status"
                    triggerClassName={cn(
                      "border",
                      statusBadgeClass(viewRow.status),
                    )}
                    value={viewRow.status}
                    onChange={(status) => void updateStatus(viewRow.id, status)}
                    options={[
                      { value: "new", label: "New" },
                      { value: "read", label: "Read" },
                      { value: "archived", label: "Archived" },
                    ]}
                  />
                </label>
              ) : (
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em]",
                    statusBadgeClass(viewRow.status),
                  )}
                >
                  {statusLabel(viewRow.status)}
                </span>
              )}
            </div>

            <dl className="divide-y divide-[var(--admin-border)] rounded-lg border border-[var(--admin-border)] bg-white">
              {payloadEntries(viewRow.payload as Json).map((entry) => (
                <div
                  key={entry.key}
                  className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--admin-muted)]">
                    {entry.label}
                  </dt>
                  <dd className="whitespace-pre-wrap break-words text-sm text-[var(--admin-ink)]">
                    {entry.key === "email" ? (
                      <a
                        href={`mailto:${entry.value}`}
                        className="text-[var(--admin-primary)] hover:underline"
                      >
                        {entry.value}
                      </a>
                    ) : entry.key === "phone" && entry.value !== "-" ? (
                      <a
                        href={`tel:${entry.value}`}
                        className="text-[var(--admin-primary)] hover:underline"
                      >
                        {entry.value}
                      </a>
                    ) : (
                      entry.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

      </EntityDetailSheet>



      <AdminModal

        open={Boolean(deleteId)}

        onOpenChange={() => setDeleteId(null)}

        title="Delete submission"

        description="This cannot be undone."

        onSave={() => void confirmDelete()}

        saveLabel="Delete"

        saveVariant="danger"

        side="bottom"

      />



      <AdminModal

        open={bulkDeleteOpen}

        onOpenChange={setBulkDeleteOpen}

        title="Delete selected submissions"

        description={`Permanently delete ${selection.selectedCount} submission${selection.selectedCount === 1 ? "" : "s"}? This cannot be undone.`}

        onSave={() => void confirmBulkDelete()}

        saveLabel={`Delete ${selection.selectedCount}`}

        saveVariant="danger"

        side="bottom"

        saving={bulkBusy}

      />

    </div>

  );

}


