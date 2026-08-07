import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminBtnPrimary } from "@/admin/adminClassNames";
import { cn } from "@/lib/utils";

type EntityDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footerLabel?: string;
};

export function EntityDetailSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footerLabel = "Close",
}: EntityDetailSheetProps) {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="admin-theme flex h-full w-full flex-col gap-0 p-0 sm:max-w-lg"
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

        <div
          className="h-1 w-full shrink-0 bg-[var(--admin-border)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Detail scroll progress"
        >
          <div
            className="h-full bg-[var(--admin-primary)] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          ref={scrollRef}
          onScroll={updateProgress}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        <SheetFooter className="mt-auto shrink-0 border-t border-[var(--admin-border)] px-5 py-4">
          <button
            type="button"
            className={cn(
              adminBtnPrimary,
              "w-full justify-between gap-3 pl-5 pr-2",
            )}
            onClick={() => onOpenChange(false)}
          >
            <span>{footerLabel}</span>
            <span className="flex size-8 items-center justify-center rounded-[calc(var(--admin-radius-lg)-2px)] bg-white text-[var(--admin-primary)]">
              <ArrowUpRight className="size-4" />
            </span>
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
