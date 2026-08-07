import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminBtnPrimary, adminBtnSecondary } from "@/admin/adminClassNames";
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
  /** bottom = confirm/delete; right = create/edit forms */
  side?: "right" | "bottom";
  saveVariant?: "primary" | "danger";
};

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

  const isBottom = side === "bottom";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton
        className={cn(
          "admin-theme flex flex-col gap-0 p-0",
          isBottom
            ? "inset-x-0 bottom-0 h-auto max-h-[88vh] rounded-t-[var(--admin-radius-lg)] border-t"
            : cn(
                "inset-y-0 right-0 h-full w-full border-l sm:max-w-xl",
                wide && "sm:max-w-2xl lg:max-w-3xl",
              ),
        )}
      >
        <SheetHeader className="shrink-0 space-y-1 border-b border-[var(--admin-border)] px-5 py-4 text-left">
          <SheetTitle className="font-display text-xl font-medium uppercase tracking-tight text-[var(--admin-ink)]">
            {title}
          </SheetTitle>
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
              className={cn(
                "min-h-0 flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                isBottom && "max-h-[50vh]",
              )}
            >
              {children}
            </div>
          </>
        ) : null}

        <SheetFooter className="shrink-0 flex-row gap-2 border-t border-[var(--admin-border)] px-5 py-4 sm:justify-end">
          {footer ?? (
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
                  className={
                    saveVariant === "danger"
                      ? "inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-lg)] bg-red-600 px-4 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      : adminBtnPrimary
                  }
                  onClick={onSave}
                  disabled={saving || saveDisabled}
                >
                  {saving ? "Working…" : saveLabel}
                </button>
              ) : null}
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
