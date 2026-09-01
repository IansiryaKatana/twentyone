import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminBtnPrimary, adminBtnSecondary, adminPageTitle } from "@/admin/adminClassNames";
import { cn } from "@/lib/utils";

type AdminModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onSave?: () => void;
  saveLabel?: string;
  saving?: boolean;
  saveDisabled?: boolean;
  wide?: boolean;
  /** bottom = centered confirm dialog; right = create/edit sheet */
  side?: "right" | "bottom";
  saveVariant?: "primary" | "danger";
};

const dangerBtnClass =
  "inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] bg-red-600 px-4 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50";

function ActionButtons({
  onOpenChange,
  onSave,
  saveLabel,
  saving,
  saveDisabled,
  saveVariant,
}: Pick<
  AdminModalProps,
  "onOpenChange" | "onSave" | "saveLabel" | "saving" | "saveDisabled" | "saveVariant"
>) {
  return (
    <>
      <button
        type="button"
        className={adminBtnSecondary}
        onClick={() => onOpenChange(false)}
        disabled={saving}
      >
        Cancel
      </button>
      {onSave ? (
        <button
          type="button"
          className={saveVariant === "danger" ? dangerBtnClass : adminBtnPrimary}
          onClick={onSave}
          disabled={saving || saveDisabled}
        >
          {saving ? "Working…" : saveLabel}
        </button>
      ) : null}
    </>
  );
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  onSave,
  saveLabel = "Save",
  saving = false,
  saveDisabled = false,
  wide = false,
  side = "right",
  saveVariant = "primary",
}: AdminModalProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setProgress(0);
      return;
    }
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max <= 0 ? 100 : Math.min(100, Math.round((el.scrollTop / max) * 100)));
  }, []);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }
    const id = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(id);
  }, [open, children, updateProgress]);

  const actions =
    footer ?? (
      <ActionButtons
        onOpenChange={onOpenChange}
        onSave={onSave}
        saveLabel={saveLabel}
        saving={saving}
        saveDisabled={saveDisabled}
        saveVariant={saveVariant}
      />
    );

  if (side === "bottom") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className="admin-theme gap-0 border-[var(--admin-border)] bg-white p-0 text-[var(--admin-ink)] sm:max-w-md"
        >
          <DialogHeader className="space-y-1 px-5 py-4 text-left">
            <DialogTitle className={adminPageTitle}>{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-sm text-[var(--admin-muted)]">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          {children ? <div className="px-5 pb-2">{children}</div> : null}
          <DialogFooter className="flex-row gap-2 border-t border-[var(--admin-border)] px-5 py-4 sm:justify-end">
            {actions}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className={cn(
          "admin-theme flex flex-col gap-0 p-0",
          "inset-y-0 right-0 h-full w-full border-l sm:max-w-xl",
          wide && "sm:max-w-2xl lg:max-w-3xl",
        )}
      >
        <SheetHeader className="shrink-0 space-y-1 border-b border-[var(--admin-border)] px-5 py-4 text-left">
          <SheetTitle className={adminPageTitle}>{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-sm text-[var(--admin-muted)]">
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>

        {children ? (
          <>
            <div
              className="h-1 w-full shrink-0 bg-[var(--admin-border)]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Form scroll progress"
            >
              <div
                className="h-full bg-[var(--admin-primary)] transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              ref={scrollRef}
              onScroll={updateProgress}
              className="min-h-0 flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {children}
            </div>
          </>
        ) : null}

        <SheetFooter className="shrink-0 flex-row gap-2 border-t border-[var(--admin-border)] px-5 py-4 sm:justify-end">
          {actions}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
