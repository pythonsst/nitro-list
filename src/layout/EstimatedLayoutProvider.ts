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

  /** 2️⃣ Extract primitives (IMPORTANT) */
  const { offsetY, height } = viewport

  /** 3️⃣ Visible indices (pure calculation) */
  const visibleIndices = useMemo(
    () => getVisibleRange(layouts, offsetY, height, bufferPx),
    [layouts, offsetY, height, bufferPx]
  )

  /** 4️⃣ Slots are committed state */
  const [slots, setSlots] = useState<readonly ViewSlot[]>([])

  /** 5️⃣ Mutations happen AFTER render */
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
