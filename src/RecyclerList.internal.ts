import type { LayoutRectangle } from './layout/LayoutRectangle'
import type { ScrollMetrics } from './windowing/ScrollMetrics'
import type { Cell } from './cell/Cell'

import { useCellRenderer } from './hooks/useCellRenderer'

/**
 * INTERNAL hook.
 * MUST ALWAYS CALL hooks in the same order.
 */
export function useRecyclerListInternal(
  layouts: readonly LayoutRectangle[],
  metrics: ScrollMetrics,
  bufferPx: number,
  getItemType: (index: number) => string
): readonly Cell[] {

  /**
   * FlashList rule:
   * Hooks are ALWAYS called.
   * Inputs are guarded instead.
   */
  const safeLayouts =
    metrics.height > 0 ? layouts : EMPTY_LAYOUTS

  const safeBufferPx =
    metrics.height > 0 ? bufferPx : 0

  return useCellRenderer(
    safeLayouts,
    metrics,
    safeBufferPx,
    getItemType
  )
}

/** Stable empty reference */
const EMPTY_LAYOUTS: readonly LayoutRectangle[] = []
