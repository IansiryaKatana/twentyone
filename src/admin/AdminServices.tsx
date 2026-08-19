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

import { ImageUploadField } from "@/admin/components/ImageUploadField";

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



type ServiceRow = Tables<"services">;

type CapabilityRow = Tables<"service_capabilities">;



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



function emptyService(): ServiceRow {

  const now = new Date().toISOString();

  return {

    id: crypto.randomUUID(),

    slug: "",

    label: "",

    index_label: "",

    title: "",

    description: "",

    detail: "",

    intro: "",

    bullets: [],

    cta: "",

    image: "",

    hero_image: "",

    sort_order: 0,

    published: true,

    created_at: now,

    updated_at: now,

  };

}



function emptyCapability(serviceId: string): CapabilityRow {

  const now = new Date().toISOString();

  return {

    id: crypto.randomUUID(),

    service_id: serviceId,

    index_label: "",

    title: "",

    description: "",

    image: "",

    sort_order: 0,

    published: true,

    created_at: now,

    updated_at: now,

  };

}



export function AdminServices() {

  const { refetch } = useCms();

  const { role } = useAdminAuth();

  const canMutate = role !== "viewer";



  const [services, setServices] = useState<ServiceRow[]>([]);

  const [capabilities, setCapabilities] = useState<CapabilityRow[]>([]);

  const [err, setErr] = useState<string | null>(null);



  const [serviceModal, setServiceModal] = useState(false);

  const [serviceDraft, setServiceDraft] = useState<ServiceRow | null>(null);

  const [capModal, setCapModal] = useState(false);

  const [capDraft, setCapDraft] = useState<CapabilityRow | null>(null);

  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  const [deleteCapId, setDeleteCapId] = useState<string | null>(null);

  const [bulkDeleteServicesOpen, setBulkDeleteServicesOpen] = useState(false);

  const [bulkDeleteCapsOpen, setBulkDeleteCapsOpen] = useState(false);

  const [bulkBusy, setBulkBusy] = useState(false);



  const capFilterDefs = useMemo<AdminFilterDef[]>(

    () => [

      {

        key: "service",

        label: "Service",

        options: services.map((s) => ({ value: s.id, label: s.label })),

      },

    ],

    [services],

  );



  const serviceFilterState = useAdminFilters([]);

  const capFilterState = useAdminFilters(capFilterDefs);



  const filteredServices = useMemo(() => {

    return services.filter((row) =>

      matchesQuery(`${row.label} ${row.slug} ${row.title}`, serviceFilterState.query),

    );

  }, [services, serviceFilterState.query]);



  const filteredCaps = useMemo(() => {

    return capabilities.filter((row) => {

      if (!matchesQuery(`${row.title} ${row.description}`, capFilterState.query)) {

        return false;

      }

      if (

        capFilterState.filters.service !== "all" &&

        row.service_id !== capFilterState.filters.service

      ) {

        return false;

      }

      return true;

    });

  }, [capabilities, capFilterState.query, capFilterState.filters]);



  const servicePagination = useAdminTablePagination(filteredServices);

  const capPagination = useAdminTablePagination(filteredCaps);

  const serviceSelection = useAdminSelection(filteredServices);

  const capSelection = useAdminSelection(filteredCaps);

  const servicePageIds = servicePagination.pageRows.map((r) => r.id);

  const capPageIds = capPagination.pageRows.map((r) => r.id);



  const refresh = useCallback(async () => {

    const sb = getSupabase();

    if (!sb) return;

    const [sRes, cRes] = await Promise.all([

      sb.from("services").select("*").order("sort_order", { ascending: true }),

      sb.from("service_capabilities").select("*").order("sort_order", { ascending: true }),

    ]);

    if (sRes.error || cRes.error) setErr(sRes.error?.message ?? cRes.error?.message ?? "Load failed");

    else {

      setErr(null);

      setServices(sRes.data ?? []);

      setCapabilities(cRes.data ?? []);

    }

  }, []);



  useEffect(() => {

    void refresh();

  }, [refresh]);



  useEffect(() => {

    servicePagination.resetPage();

  }, [serviceFilterState.query, servicePagination.resetPage]);



  useEffect(() => {

    capPagination.resetPage();

  }, [capFilterState.query, capFilterState.filters, capPagination.resetPage]);



  const serviceReorder = useAdminReorder({

    table: "services",

    rows: services,

    setRows: setServices,

    pageRows: servicePagination.pageRows,

    page: servicePagination.page,

    pageSize: servicePagination.pageSize,

    canMutate,

    filtersActive: serviceFilterState.activeCount > 0,

    onError: setErr,

    onPersisted: () => refetch(),

    refresh,

  });



  const capReorder = useAdminReorder({

    table: "service_capabilities",

    rows: capabilities,

    setRows: setCapabilities,

    pageRows: capPagination.pageRows,

    page: capPagination.page,

    pageSize: capPagination.pageSize,

    canMutate,

    filtersActive: capFilterState.activeCount > 0,

    onError: setErr,

    onPersisted: () => refetch(),

    refresh,

  });



  const saveService = async () => {

    if (!serviceDraft || !canMutate) return;

    const slugErr = validateSlug(serviceDraft.slug);

    if (slugErr) {

      setSaveErr(slugErr);

      return;

    }

    const sb = getSupabase();

    if (!sb) return;

    setSaving(true);

    const { error } = await sb.from("services").upsert(

      { ...serviceDraft, updated_at: new Date().toISOString() },

      { onConflict: "id" },

    );

    setSaving(false);

    if (error) {

      setSaveErr(error.message);

      return;

    }

    setServiceModal(false);

    await refresh();

    await refetch();

  };



  const saveCap = async () => {

    if (!capDraft || !canMutate) return;

    const sb = getSupabase();

    if (!sb) return;

    setSaving(true);

    const { error } = await sb.from("service_capabilities").upsert(

      { ...capDraft, updated_at: new Date().toISOString() },

      { onConflict: "id" },

    );

    setSaving(false);

    if (error) {

      setSaveErr(error.message);

      return;

    }

    setCapModal(false);

    await refresh();

    await refetch();

  };



  const confirmBulkDeleteServices = async () => {

    if (!canMutate || serviceSelection.selectedCount === 0) return;

    const sb = getSupabase();

    if (!sb) return;

    setBulkBusy(true);

    const { error } = await sb.from("services").delete().in("id", serviceSelection.selectedList);

    setBulkBusy(false);

    if (error) {

      setErr(error.message);

      return;

    }

    setBulkDeleteServicesOpen(false);

    serviceSelection.clear();

    await refresh();

    await refetch();

  };



  const confirmBulkDeleteCaps = async () => {

    if (!canMutate || capSelection.selectedCount === 0) return;

    const sb = getSupabase();

    if (!sb) return;

    setBulkBusy(true);

    const { error } = await sb

      .from("service_capabilities")

      .delete()

      .in("id", capSelection.selectedList);

    setBulkBusy(false);

    if (error) {

      setErr(error.message);

      return;

    }

    setBulkDeleteCapsOpen(false);

    capSelection.clear();

    await refresh();

    await refetch();

  };



  return (

    <div className="space-y-10">

      <AdminPageHeading

        title="Services"

        description="Service lines and capability cards. Drag rows to set display order when filters are cleared."

      />

      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      {serviceReorder.reordering || capReorder.reordering ? (

        <p className="text-sm text-[var(--admin-muted)]">Saving order…</p>

      ) : null}



      <section>

        <div className="mb-4 flex justify-between gap-3">

          <h2 className={adminSectionTitle}>Services</h2>

          {canMutate ? (

            <button

              type="button"

              className={adminBtnPrimary}

              onClick={() => {

                setServiceDraft(emptyService());

                setSaveErr(null);

                setServiceModal(true);

              }}

            >

              <Plus className="size-4" />

              Add service

            </button>

          ) : null}

        </div>

        <div className={adminTableWrap}>

          <AdminFilters

            query={serviceFilterState.query}

            onQueryChange={serviceFilterState.setQuery}

            queryPlaceholder="Search label, slug, title…"

            onReset={serviceFilterState.reset}

            activeCount={serviceFilterState.activeCount}

            trailing={

              <p className="text-sm text-[var(--admin-muted)] md:ml-auto">

                {filteredServices.length} of {services.length}

              </p>

            }

          />



          {canMutate ? (

            <AdminBulkBar

              count={serviceSelection.selectedCount}

              onClear={serviceSelection.clear}

              busy={bulkBusy}

              onDelete={() => setBulkDeleteServicesOpen(true)}

            />

          ) : null}



          <AdminDndProvider

            sensors={serviceReorder.sensors}

            collisionDetection={serviceReorder.collisionDetection}

            onDragEnd={serviceReorder.onDragEnd}

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

                        aria-label="Select all services on page"

                        checked={serviceSelection.pageAllSelected(servicePageIds)}

                        ref={(el) => {

                          if (el) el.indeterminate = serviceSelection.pageSomeSelected(servicePageIds);

                        }}

                        onChange={() => serviceSelection.toggleAll(servicePageIds)}

                      />

                    </th>

                  ) : null}

                  <th className={adminTableHeadCell}>Label</th>

                  <th className={adminTableHeadCell}>Slug</th>

                  <th className={adminTableHeadCell} />

                </tr>

              </thead>

              <AdminSortableBody itemIds={serviceReorder.itemIds} className="divide-y divide-[var(--admin-border)]">

                {servicePagination.pageRows.map((row) => (

                  <AdminSortableTr

                    key={row.id}

                    id={row.id}

                    canReorder={serviceReorder.canReorder}

                    showHandle={canMutate}

                    selected={serviceSelection.isSelected(row.id)}

                    dragLabel={row.label || row.title}

                  >

                    {canMutate ? (

                      <td className={adminTableCell}>

                        <input

                          type="checkbox"

                          aria-label={`Select ${row.label}`}

                          checked={serviceSelection.isSelected(row.id)}

                          onChange={() => serviceSelection.toggle(row.id)}

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

                                setServiceDraft({ ...row });

                                setServiceModal(true);

                              }}

                            >

                              <Pencil className="size-4" />

                            </button>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => setDeleteServiceId(row.id)}

                            >

                              <Trash2 className="size-4" />

                            </button>

                          </>

                        ) : null}

                      </div>

                    </td>

                  </AdminSortableTr>

                ))}

                {servicePagination.pageRows.length === 0 ? (

                  <tr>

                    <td className={adminTableCell} colSpan={canMutate ? 5 : 3}>

                      <p className="py-8 text-center text-[var(--admin-muted)]">

                        No services match these filters.

                      </p>

                    </td>

                  </tr>

                ) : null}

              </AdminSortableBody>

            </table>

          </AdminDndProvider>

          <AdminTablePagination {...servicePagination} onPageChange={servicePagination.setPage} />

        </div>

      </section>



      <section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          <h2 className={adminSectionTitle}>Capabilities</h2>

          {canMutate ? (

            <button

              type="button"

              className={adminBtnPrimary}

              disabled={services.length === 0}

              onClick={() => {

                const sid =

                  capFilterState.filters.service !== "all"

                    ? capFilterState.filters.service

                    : services[0]?.id;

                if (!sid) return;

                setCapDraft(emptyCapability(sid));

                setCapModal(true);

              }}

            >

              <Plus className="size-4" />

              Add capability

            </button>

          ) : null}

        </div>

        <div className={adminTableWrap}>

          <AdminFilters

            query={capFilterState.query}

            onQueryChange={capFilterState.setQuery}

            queryPlaceholder="Search title, description…"

            filterDefs={capFilterDefs}

            filters={capFilterState.filters}

            onFilterChange={capFilterState.setFilter}

            onReset={capFilterState.reset}

            activeCount={capFilterState.activeCount}

            trailing={

              <p className="text-sm text-[var(--admin-muted)] md:ml-auto">

                {filteredCaps.length} of {capabilities.length}

              </p>

            }

          />



          {canMutate ? (

            <AdminBulkBar

              count={capSelection.selectedCount}

              onClear={capSelection.clear}

              busy={bulkBusy}

              onDelete={() => setBulkDeleteCapsOpen(true)}

            />

          ) : null}



          <AdminDndProvider

            sensors={capReorder.sensors}

            collisionDetection={capReorder.collisionDetection}

            onDragEnd={capReorder.onDragEnd}

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

                        aria-label="Select all capabilities on page"

                        checked={capSelection.pageAllSelected(capPageIds)}

                        ref={(el) => {

                          if (el) el.indeterminate = capSelection.pageSomeSelected(capPageIds);

                        }}

                        onChange={() => capSelection.toggleAll(capPageIds)}

                      />

                    </th>

                  ) : null}

                  <th className={adminTableHeadCell}>Title</th>

                  <th className={adminTableHeadCell}>Service</th>

                  <th className={adminTableHeadCell} />

                </tr>

              </thead>

              <AdminSortableBody itemIds={capReorder.itemIds} className="divide-y divide-[var(--admin-border)]">

                {capPagination.pageRows.map((row) => (

                  <AdminSortableTr

                    key={row.id}

                    id={row.id}

                    canReorder={capReorder.canReorder}

                    showHandle={canMutate}

                    selected={capSelection.isSelected(row.id)}

                    dragLabel={row.title}

                  >

                    {canMutate ? (

                      <td className={adminTableCell}>

                        <input

                          type="checkbox"

                          aria-label={`Select ${row.title}`}

                          checked={capSelection.isSelected(row.id)}

                          onChange={() => capSelection.toggle(row.id)}

                        />

                      </td>

                    ) : null}

                    <td className={adminTableCell}>{row.title}</td>

                    <td className={adminTableCell}>

                      {services.find((s) => s.id === row.service_id)?.label ?? "—"}

                    </td>

                    <td className={adminTableCell}>

                      <div className="flex justify-end gap-1">

                        {canMutate ? (

                          <>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => {

                                setCapDraft({ ...row });

                                setCapModal(true);

                              }}

                            >

                              <Pencil className="size-4" />

                            </button>

                            <button

                              type="button"

                              className={adminBtnGhost}

                              onClick={() => setDeleteCapId(row.id)}

                            >

                              <Trash2 className="size-4" />

                            </button>

                          </>

                        ) : (

                          <Eye className="size-4 opacity-30" />

                        )}

                      </div>

                    </td>

                  </AdminSortableTr>

                ))}

                {capPagination.pageRows.length === 0 ? (

                  <tr>

                    <td className={adminTableCell} colSpan={canMutate ? 5 : 3}>

                      <p className="py-8 text-center text-[var(--admin-muted)]">

                        No capabilities match these filters.

                      </p>

                    </td>

                  </tr>

                ) : null}

              </AdminSortableBody>

            </table>

          </AdminDndProvider>

          <AdminTablePagination {...capPagination} onPageChange={capPagination.setPage} />

        </div>

      </section>



      <AdminModal

        open={serviceModal}

        onOpenChange={setServiceModal}

        title="Service"

        onSave={() => void saveService()}

        saving={saving}

        wide

        side="right"

      >

        {serviceDraft ? (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>

              <label className={adminLabel}>Label</label>

              <input

                className={adminInput}

                value={serviceDraft.label}

                onChange={(e) => setServiceDraft({ ...serviceDraft, label: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Slug</label>

              <input

                className={adminInput}

                value={serviceDraft.slug}

                onChange={(e) => setServiceDraft({ ...serviceDraft, slug: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Title</label>

              <input

                className={adminInput}

                value={serviceDraft.title}

                onChange={(e) => setServiceDraft({ ...serviceDraft, title: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Index</label>

              <input

                className={adminInput}

                value={serviceDraft.index_label ?? ""}

                onChange={(e) => setServiceDraft({ ...serviceDraft, index_label: e.target.value })}

                placeholder="01"

              />

            </div>

            <div className="md:col-span-2">

              <label className={adminLabel}>Description</label>

              <textarea

                className={adminTextarea}

                value={serviceDraft.description}

                onChange={(e) => setServiceDraft({ ...serviceDraft, description: e.target.value })}

              />

            </div>

            <div className="md:col-span-2">

              <label className={adminLabel}>CTA label</label>

              <input

                className={adminInput}

                value={serviceDraft.cta}

                onChange={(e) => setServiceDraft({ ...serviceDraft, cta: e.target.value })}

                placeholder="Let's Design Your Space"

              />

            </div>

            <div className="md:col-span-2">

              <label className={adminLabel}>Bullets (one per line)</label>

              <textarea

                className={adminTextarea}

                value={arrayToLines(serviceDraft.bullets)}

                onChange={(e) =>

                  setServiceDraft({ ...serviceDraft, bullets: linesToArray(e.target.value) })

                }

              />

            </div>

            <div className="md:col-span-2">

              <ImageUploadField

                label="Card image (homepage)"

                value={serviceDraft.image}

                onChange={(image) =>

                  setServiceDraft({

                    ...serviceDraft,

                    image,

                    hero_image: serviceDraft.hero_image || image,

                  })

                }

                folder="services"

              />

            </div>

            <div className="md:col-span-2">

              <ImageUploadField

                label="Featured image (services page)"

                value={serviceDraft.hero_image}

                onChange={(hero_image) => setServiceDraft({ ...serviceDraft, hero_image })}

                folder="services"

              />

            </div>

            {saveErr ? <p className="md:col-span-2 text-sm text-red-600">{saveErr}</p> : null}

          </div>

        ) : null}

      </AdminModal>



      <AdminModal

        open={capModal}

        onOpenChange={setCapModal}

        title="Capability"

        onSave={() => void saveCap()}

        saving={saving}

        side="right"

      >

        {capDraft ? (

          <div className="space-y-4">

            <div>

              <label className={adminLabel}>Service</label>

              <select

                className={adminSelect}

                value={capDraft.service_id}

                onChange={(e) => setCapDraft({ ...capDraft, service_id: e.target.value })}

              >

                {services.map((s) => (

                  <option key={s.id} value={s.id}>

                    {s.label}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className={adminLabel}>Title</label>

              <input

                className={adminInput}

                value={capDraft.title}

                onChange={(e) => setCapDraft({ ...capDraft, title: e.target.value })}

              />

            </div>

            <div>

              <label className={adminLabel}>Description</label>

              <textarea

                className={adminTextarea}

                value={capDraft.description}

                onChange={(e) => setCapDraft({ ...capDraft, description: e.target.value })}

              />

            </div>

            <ImageUploadField

              value={capDraft.image}

              onChange={(image) => setCapDraft({ ...capDraft, image })}

              folder="services"

            />

          </div>

        ) : null}

      </AdminModal>



      <AdminModal

        open={Boolean(deleteServiceId)}

        onOpenChange={() => setDeleteServiceId(null)}

        title="Delete service"

        description="This cannot be undone."

        onSave={async () => {

          if (!deleteServiceId || !canMutate) return;

          const sb = getSupabase();

          if (!sb) return;

          const { error } = await sb.from("services").delete().eq("id", deleteServiceId);

          if (error) setErr(error.message);

          else {

            setDeleteServiceId(null);

            await refresh();

            await refetch();

          }

        }}

        saveLabel="Delete"

        saveVariant="danger"

        side="bottom"

      />



      <AdminModal

        open={Boolean(deleteCapId)}

        onOpenChange={() => setDeleteCapId(null)}

        title="Delete capability"

        description="This cannot be undone."

        onSave={async () => {

          if (!deleteCapId || !canMutate) return;

          const sb = getSupabase();

          if (!sb) return;

          const { error } = await sb.from("service_capabilities").delete().eq("id", deleteCapId);

          if (error) setErr(error.message);

          else {

            setDeleteCapId(null);

            await refresh();

            await refetch();

          }

        }}

        saveLabel="Delete"

        saveVariant="danger"

        side="bottom"

      />



      <AdminModal

        open={bulkDeleteServicesOpen}

        onOpenChange={setBulkDeleteServicesOpen}

        title="Delete selected services"

        description={`Permanently delete ${serviceSelection.selectedCount} service${serviceSelection.selectedCount === 1 ? "" : "s"}? This cannot be undone.`}

        onSave={() => void confirmBulkDeleteServices()}

        saveLabel={`Delete ${serviceSelection.selectedCount}`}

        saveVariant="danger"

        side="bottom"

        saving={bulkBusy}

      />



      <AdminModal

        open={bulkDeleteCapsOpen}

        onOpenChange={setBulkDeleteCapsOpen}

        title="Delete selected capabilities"

        description={`Permanently delete ${capSelection.selectedCount} capabilit${capSelection.selectedCount === 1 ? "y" : "ies"}? This cannot be undone.`}

        onSave={() => void confirmBulkDeleteCaps()}

        saveLabel={`Delete ${capSelection.selectedCount}`}

        saveVariant="danger"

        side="bottom"

        saving={bulkBusy}

      />

    </div>

  );

}


