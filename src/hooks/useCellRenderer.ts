import { useEffect, useMemo, useRef, useState } from 'react'
import type { Cell } from '../cell/Cell'
import { CellRecycler } from '../cell/CellRecycler'
import { findVisibleIndexRange } from '../windowing/findVisibleIndexRange'
import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { ScrollMetrics } from '../windowing/ScrollMetrics'

/**
 * 🔒 Stable empty references (module-level)
 * These MUST NOT be recreated per render.
 */
const EMPTY_INDICES: readonly number[] = []

/**
 * React bridge for CellRecycler.
 * FlashList equivalent: useCellRenderer
 *
 * Responsibilities:
 * - Translate scroll state → visible indices
 * - Ask recycler for physical cells
 * - Commit results with referential stability
 *
 * Responsibilities it does NOT have:
 * ❌ Layout mutation
 * ❌ Measurement
 * ❌ Rendering
 */
export function useCellRenderer(
  layouts: readonly LayoutRectangle[],
  metrics: ScrollMetrics,
  bufferPx: number,
  getCellType: (index: number) => string
): readonly Cell[] {
  /**
   * Recycler instance is stable across renders.
   */
  const recyclerRef = useRef<CellRecycler>(new CellRecycler())

  /**
   * Compute visible indices.
   * PURE + TOTAL:
   * - Never throws
   * - Always returns the same reference when empty
   */
  const visibleIndices = useMemo(
    () =>
      layouts.length === 0
        ? EMPTY_INDICES
        : findVisibleIndexRange(
            layouts,
            metrics,
            bufferPx
          ),
    [layouts, metrics.offsetY, metrics.height, bufferPx]
  )

  /**
   * Physical cells to render.
   */
  const [cells, setCells] =
    useState<readonly Cell[]>([])

  /**
   * Reconcile visible indices → physical cells.
   *
   * FlashList invariant:
   * - Only update state if identity truly changed
   * - Prevents pointless re-renders
   */
  useEffect(() => {
    const next =
      recyclerRef.current.reconcile(
        visibleIndices,
        getCellType
      )

    setCells(prev =>
      prev.length === next.length &&
      prev.every((c, i) => c === next[i])
        ? prev
        : next
    )
  }, [visibleIndices, getCellType])

  return cells
}
