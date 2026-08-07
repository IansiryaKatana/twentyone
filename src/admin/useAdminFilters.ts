import { useMemo, useState } from "react";

export type AdminFilterOption = {
  value: string;
  label: string;
};

export type AdminFilterDef = {
  key: string;
  label: string;
  options: AdminFilterOption[];
};

export function useAdminFilters(filterDefs: AdminFilterDef[] = []) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(() =>
    Object.fromEntries(filterDefs.map((f) => [f.key, "all"])),
  );

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setQuery("");
    setFilters(Object.fromEntries(filterDefs.map((f) => [f.key, "all"])));
  };

  const activeCount = useMemo(() => {
    let n = query.trim() ? 1 : 0;
    for (const def of filterDefs) {
      if ((filters[def.key] ?? "all") !== "all") n += 1;
    }
    return n;
  }, [query, filters, filterDefs]);

  return {
    query,
    setQuery,
    filters,
    setFilter,
    reset,
    activeCount,
  };
}

export function matchesQuery(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystack.toLowerCase().includes(q);
}
