import * as React from "react";

const SWIPE_OFFSET = 48;

type UseCarouselSwipeOptions = {
  onNext: () => void;
  onPrev: () => void;
  canNext?: boolean;
  canPrev?: boolean;
  /** Defaults to true. Pass false to disable. */
  enabled?: boolean;
};

type SwipeStart = {
  x: number;
  y: number;
  pointerId: number;
};

/**
 * Pointer-based horizontal swipe for carousels.
 * Works with nested Links (suppresses click after a swipe) and on touch devices.
 */
export function useCarouselSwipe({
  onNext,
  onPrev,
  canNext = true,
  canPrev = true,
  enabled = true,
}: UseCarouselSwipeOptions) {
  const startRef = React.useRef<SwipeStart | null>(null);
  const swipedRef = React.useRef(false);

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      if (!enabled || event.button !== 0) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-no-swipe]")) return;
      startRef.current = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      };
      swipedRef.current = false;
    },
    [enabled],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent) => {
      if (!enabled || !startRef.current) return;
      if (startRef.current.pointerId !== event.pointerId) return;

      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;

      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
        swipedRef.current = true;
        try {
          (event.currentTarget as HTMLElement).setPointerCapture(
            event.pointerId,
          );
        } catch {
          /* ignore capture errors */
        }
      }
    },
    [enabled],
  );

  const endSwipe = React.useCallback(
    (event: React.PointerEvent) => {
      if (!enabled || !startRef.current) return;
      if (startRef.current.pointerId !== event.pointerId) return;

      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;
      startRef.current = null;

      if (Math.abs(dx) < SWIPE_OFFSET || Math.abs(dx) < Math.abs(dy)) return;

      swipedRef.current = true;
      if (dx < 0 && canNext) onNext();
      else if (dx > 0 && canPrev) onPrev();
    },
    [enabled, canNext, canPrev, onNext, onPrev],
  );

  const onPointerCancel = React.useCallback(() => {
    startRef.current = null;
  }, []);

  const onClickCapture = React.useCallback((event: React.MouseEvent) => {
    if (!swipedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    swipedRef.current = false;
  }, []);

  if (!enabled) {
    return {};
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endSwipe,
    onPointerCancel,
    onClickCapture,
    style: {
      touchAction: "pan-y" as const,
      userSelect: "none" as const,
      WebkitUserSelect: "none" as const,
    },
  };
}
