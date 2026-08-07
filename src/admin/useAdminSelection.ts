import { useCallback, useEffect, useMemo, useState } from "react";

export function useAdminSelection<T extends { id: string }>(rows: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const rowIds = useMemo(() => new Set(rows.map((r) => r.id)), [rows]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (rowIds.has(id)) next.add(id);
      }
      return next.size === prev.size ? prev : next;
    });
  }, [rowIds]);

  const selectedCount = selectedIds.size;

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
        if (allSelected) {
          const next = new Set(prev);
          for (const id of ids) next.delete(id);
          return next;
        }
        const next = new Set(prev);
        for (const id of ids) next.add(id);
        return next;
      });
    },
    [],
  );

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const pageAllSelected = useCallback(
    (ids: string[]) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
    [selectedIds],
  );

  const pageSomeSelected = useCallback(
    (ids: string[]) => ids.some((id) => selectedIds.has(id)) && !pageAllSelected(ids),
    [selectedIds, pageAllSelected],
  );

  return {
    selectedIds,
    selectedCount,
    selectedList: [...selectedIds],
    isSelected,
    toggle,
    toggleAll,
    clear,
    pageAllSelected,
    pageSomeSelected,
  };
}
