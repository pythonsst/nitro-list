// src/useRecyclerList.ts

import { useCallback, useRef, useState } from 'react';
import type { ReusableView } from './ReusableView';

export function useRecyclerList() {
  const [views, setViews] = useState<ReusableView[]>([]);

  const activeViewsRef = useRef<Map<number, ReusableView>>(new Map());
  const recycledViewsRef = useRef<ReusableView[]>([]);
  const nextIdRef = useRef(0);

  /**
   * Reconciles the set of visible indices with existing slots.
   * Produces a stable list of reusable views.
   */
  const reconcile = useCallback((renderIndices: readonly number[]) => {
    const active = activeViewsRef.current;
    const recycled = recycledViewsRef.current;

    const nextActive = new Map<number, ReusableView>();
    const nextViews: ReusableView[] = [];

    for (const index of renderIndices) {
      let slot = active.get(index);

      if (!slot) {
        const reused = recycled.pop();
        slot =
          reused ??
          {
            key: `recycler-slot-${nextIdRef.current++}`,
            index,
          };

        slot.index = index;
      }

      nextActive.set(index, slot);
      nextViews.push(slot);
    }

    // Move unused active slots back into the recycle pool
    for (const [index, slot] of active) {
      if (!nextActive.has(index)) {
        recycled.push(slot);
      }
    }

    activeViewsRef.current = nextActive;
    setViews(nextViews);
  }, []);

  return {
    views,
    reconcile,
  };
}
