import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminBtnGhost } from "@/admin/adminClassNames";

type AdminTablePaginationProps = {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export function AdminTablePagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  hasPrev,
  hasNext,
}: AdminTablePaginationProps) {
  if (totalRows <= pageSize) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-[var(--admin-muted)]">
      <p>
        Showing {start}-{end} of {totalRows}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className={adminBtnGhost}
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="px-2 tabular-nums">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className={adminBtnGhost}
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
