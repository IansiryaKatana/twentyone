import type { ReactNode } from "react";
import {
  DndContext,
  type CollisionDetection,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { adminTableCell } from "@/admin/adminClassNames";
import { cn } from "@/lib/utils";

export function AdminDndProvider({
  sensors,
  collisionDetection,
  onDragEnd,
  children,
}: {
  sensors: SensorDescriptor<SensorOptions>[];
  collisionDetection: CollisionDetection;
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  );
}

export function AdminSortableBody({
  itemIds,
  className,
  children,
}: {
  itemIds: UniqueIdentifier[];
  className?: string;
  children: ReactNode;
}) {
  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <tbody className={className}>{children}</tbody>
    </SortableContext>
  );
}

export function AdminSortableTr({
  id,
  canReorder,
  showHandle,
  selected,
  dragLabel,
  children,
}: {
  id: string;
  canReorder: boolean;
  showHandle: boolean;
  selected?: boolean;
  dragLabel: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id,
      disabled: !canReorder,
    });

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        selected
          ? "bg-[color-mix(in_srgb,var(--admin-primary)_6%,white)]"
          : undefined,
        isDragging && "relative z-10 bg-white opacity-95 shadow-md",
      )}
    >
      {showHandle ? (
        <td className={adminTableCell}>
          <button
            type="button"
            className={cn(
              "inline-flex cursor-grab touch-none items-center justify-center rounded p-1 text-[var(--admin-muted)] active:cursor-grabbing",
              canReorder
                ? "hover:bg-[var(--admin-border)] hover:text-[var(--admin-fg)]"
                : "cursor-not-allowed opacity-40",
            )}
            aria-label={
              canReorder ? `Drag to reorder ${dragLabel}` : "Clear filters to reorder"
            }
            title={canReorder ? "Drag to reorder" : "Clear filters to reorder"}
            disabled={!canReorder}
            {...(canReorder ? { ...attributes, ...listeners } : {})}
          >
            <GripVertical className="size-4" />
          </button>
        </td>
      ) : null}
      {children}
    </tr>
  );
}
