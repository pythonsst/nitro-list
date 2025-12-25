import { useMemo, useRef, useEffect, useState } from 'react'
import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { Viewport } from '../windowing/Viewport'
import { getVisibleRange } from '../windowing/BinarySearchWindow'
import { ViewRecycler } from '../recycler/ViewRecycler'
import type { ViewSlot } from '../recycler/ViewSlot'

export function useRecyclerList(
  layouts: readonly LayoutRectangle[],
  viewport: Viewport,
  bufferPx: number,
  getItemType: (index: number) => string
): readonly ViewSlot[] {
  /** 1️⃣ Stable recycler (never null) */
  const recyclerRef = useRef<ViewRecycler>(new ViewRecycler())

  /** 2️⃣ Visible indices (pure calculation) */
  const visibleIndices = useMemo(
    () => getVisibleRange(layouts, viewport, bufferPx),
    [layouts, viewport, bufferPx]
  )

  /** 3️⃣ Slots are state, not computed during render */
  const [slots, setSlots] = useState<readonly ViewSlot[]>([])

  /** 4️⃣ Mutations happen AFTER render */
  useEffect(() => {
    const recycler = recyclerRef.current

    const nextSlots = visibleIndices.map((index) =>
      recycler.acquire(index, getItemType(index))
    )

    recycler.releaseUnused(visibleIndices)

    setSlots(nextSlots)
  }, [visibleIndices, getItemType])

  return slots
}
