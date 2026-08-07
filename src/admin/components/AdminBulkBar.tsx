import { Trash2, CheckCircle2, CircleSlash, MailOpen, Archive } from "lucide-react";
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/admin/adminClassNames";

type AdminBulkBarProps = {
  count: number;
  onClear: () => void;
  onDelete?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onMarkRead?: () => void;
  onArchive?: () => void;
  busy?: boolean;
};

export function AdminBulkBar({
  count,
  onClear,
  onDelete,
  onPublish,
  onUnpublish,
  onMarkRead,
  onArchive,
  busy = false,
}: AdminBulkBarProps) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-primary)_8%,white)] px-4 py-3">
      <p className="mr-auto text-sm font-medium text-[var(--admin-ink)]">
        {count} selected
      </p>
      {onMarkRead ? (
        <button
          type="button"
          className={adminBtnSecondary}
          disabled={busy}
          onClick={onMarkRead}
        >
          <MailOpen className="size-4" />
          Mark read
        </button>
      ) : null}
      {onArchive ? (
        <button
          type="button"
          className={adminBtnSecondary}
          disabled={busy}
          onClick={onArchive}
        >
          <Archive className="size-4" />
          Archive
        </button>
      ) : null}
      {onPublish ? (
        <button
          type="button"
          className={adminBtnSecondary}
          disabled={busy}
          onClick={onPublish}
        >
          <CheckCircle2 className="size-4" />
          Publish
        </button>
      ) : null}
      {onUnpublish ? (
        <button
          type="button"
          className={adminBtnSecondary}
          disabled={busy}
          onClick={onUnpublish}
        >
          <CircleSlash className="size-4" />
          Unpublish
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          className={adminBtnDanger}
          disabled={busy}
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      ) : null}
      <button type="button" className={adminBtnPrimary} disabled={busy} onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
