import { useMemo, useRef } from 'react'
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
  const recyclerRef = useRef<ViewRecycler | null>(null)

  if (recyclerRef.current === null) {
    recyclerRef.current = new ViewRecycler()
  }

  const { offsetY, height } = viewport

  const visibleIndices = useMemo(
    () => getVisibleRange(layouts, offsetY, height, bufferPx),
    [layouts, offsetY, height, bufferPx]
  )

  const visibleSet = useMemo(
    () => new Set(visibleIndices),
    [visibleIndices]
  )

  const recycler = recyclerRef.current

  const slots = visibleIndices.map((index) =>
    recycler.acquire(index, getItemType(index))
  )

  recycler.releaseUnused(visibleSet)

  return slots
}
