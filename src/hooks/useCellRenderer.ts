import { useEffect, useMemo, useRef, useState } from 'react'
import type { Cell } from '../cell/Cell'
import { CellRecycler } from '../cell/CellRecycler'
import { findVisibleIndexRange } from '../windowing/findVisibleIndexRange'
import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { ScrollMetrics } from '../windowing/ScrollMetrics'

/**
 * React bridge for CellRecycler.
 * FlashList equivalent: useCellRenderer
 */
export function useCellRenderer(
  layouts: readonly LayoutRectangle[],
  metrics: ScrollMetrics,
  bufferPx: number,
  getCellType: (index: number) => string
): readonly Cell[] {
  const recyclerRef = useRef(new CellRecycler())

  const visibleIndices = useMemo(
    () =>
      findVisibleIndexRange(
        layouts,
        metrics,
        bufferPx
      ),
    [layouts, metrics.offsetY, metrics.height, bufferPx]
  )

  const [cells, setCells] = useState<readonly Cell[]>([])

  useEffect(() => {
    const next = recyclerRef.current.reconcile(
      visibleIndices,
      getCellType
    )

    // FlashList-style commit guard
    setCells(prev =>
      prev.length === next.length &&
      prev.every((c, i) => c === next[i])
        ? prev
        : next
    )
  }, [visibleIndices, getCellType])

  return cells
}
