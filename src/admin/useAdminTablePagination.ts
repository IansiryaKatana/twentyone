import { useCallback, useMemo, useState } from "react";

export const ADMIN_PAGE_SIZE = 20;

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateSlug(slug: string): string | null {
  const trimmed = slug.trim();
  if (!trimmed) return "Slug is required.";
  if (!SLUG_REGEX.test(trimmed)) {
    return "Slug must use lowercase letters, numbers, and hyphens only.";
  }
  return null;
}

export function useAdminTablePagination<T>(rows: T[], pageSize = ADMIN_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  const goToPage = useCallback(
    (next: number) => {
      setPage(Math.min(Math.max(1, next), totalPages));
    },
    [totalPages],
  );

  const resetPage = useCallback(() => setPage(1), []);

  return {
    page: safePage,
    pageSize,
    totalPages,
    totalRows: rows.length,
    pageRows,
    setPage: goToPage,
    resetPage,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}
