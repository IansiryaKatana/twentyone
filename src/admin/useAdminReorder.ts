import { useCallback, useState } from "react";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { getSupabase } from "@/integrations/supabase/client";

export type AdminReorderRow = {
  id: string;
  sort_order: number;
  updated_at?: string;
};

export type AdminReorderTable =
  | "testimonials"
  | "team_members"
  | "awards"
  | "why_us"
  | "projects"
  | "journal_posts"
  | "services"
  | "service_capabilities"
  | "faq_topics"
  | "faq_entries";

type UseAdminReorderOptions<T extends AdminReorderRow> = {
  table: AdminReorderTable;
  rows: T[];
  setRows: (rows: T[]) => void;
  pageRows: T[];
  page: number;
  pageSize: number;
  canMutate: boolean;
  /** True when search/filters are active - drag is disabled so order maps cleanly to `rows`. */
  filtersActive: boolean;
  onError?: (message: string) => void;
  onPersisted?: () => void | Promise<void>;
  refresh?: () => void | Promise<void>;
};

export function useAdminReorder<T extends AdminReorderRow>({
  table,
  rows,
  setRows,
  pageRows,
  page,
  pageSize,
  canMutate,
  filtersActive,
  onError,
  onPersisted,
  refresh,
}: UseAdminReorderOptions<T>) {
  const [reordering, setReordering] = useState(false);
  const canReorder = canMutate && !filtersActive && !reordering;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persistOrder = useCallback(
    async (ordered: T[]) => {
      const sb = getSupabase();
      if (!sb) return;

      const now = new Date().toISOString();
      const withOrder = ordered.map((row, index) => ({
        ...row,
        sort_order: index,
        updated_at: now,
      }));

      setRows(withOrder);
      setReordering(true);

      const results = await Promise.all(
        withOrder.map((row) =>
          sb
            .from(table)
            .update({ sort_order: row.sort_order, updated_at: row.updated_at })
            .eq("id", row.id),
        ),
      );

      setReordering(false);

      const failed = results.find((result) => result.error);
      if (failed?.error) {
        onError?.(failed.error.message);
        await refresh?.();
        return;
      }

      await onPersisted?.();
    },
    [table, setRows, onError, onPersisted, refresh],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!canReorder) return;
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const pageStart = (page - 1) * pageSize;
      const oldIndex = pageRows.findIndex((row) => row.id === active.id);
      const newIndex = pageRows.findIndex((row) => row.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const reorderedPage = arrayMove(pageRows, oldIndex, newIndex);
      const next = [...rows];
      next.splice(pageStart, pageRows.length, ...reorderedPage);
      void persistOrder(next);
    },
    [canReorder, page, pageSize, pageRows, rows, persistOrder],
  );

  return {
    sensors,
    canReorder,
    reordering,
    onDragEnd,
    itemIds: pageRows.map((row) => row.id) as UniqueIdentifier[],
    collisionDetection: closestCenter,
  };
}
