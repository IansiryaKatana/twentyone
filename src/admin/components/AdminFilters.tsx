import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { AdminSelect } from "@/admin/components/AdminSelect";
import {
  adminBtnGhost,
  adminInput,
} from "@/admin/adminClassNames";
import type { AdminFilterDef } from "@/admin/useAdminFilters";

type AdminFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  queryPlaceholder?: string;
  filterDefs?: AdminFilterDef[];
  filters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onReset?: () => void;
  activeCount?: number;
  trailing?: ReactNode;
};

export function AdminFilters({
  query,
  onQueryChange,
  queryPlaceholder = "Search…",
  filterDefs = [],
  filters = {},
  onFilterChange,
  onReset,
  activeCount = 0,
  trailing,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[var(--admin-border)] bg-white px-4 py-3 md:flex-row md:flex-wrap md:items-center">
      <div className="relative min-w-[200px] flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--admin-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={queryPlaceholder}
          className={`${adminInput} pl-9`}
          aria-label="Search"
        />
      </div>

      {filterDefs.map((def) => (
        <div key={def.key} className="min-w-[140px]">
          <label className="sr-only" htmlFor={`filter-${def.key}`}>
            {def.label}
          </label>
          <AdminSelect
            id={`filter-${def.key}`}
            aria-label={def.label}
            value={filters[def.key] ?? "all"}
            onChange={(value) => onFilterChange?.(def.key, value)}
            options={[
              { value: "all", label: `All ${def.label.toLowerCase()}` },
              ...def.options,
            ]}
          />
        </div>
      ))}

      {activeCount > 0 && onReset ? (
        <button type="button" className={adminBtnGhost} onClick={onReset}>
          <X className="size-4" />
          Clear
        </button>
      ) : null}

      {trailing}
    </div>
  );
}
