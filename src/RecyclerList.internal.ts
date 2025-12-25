import type { LayoutRectangle } from './layout/LayoutRectangle'
import type { ScrollMetrics } from './windowing/ScrollMetrics'
import type { Cell } from './cell/Cell'

import { useCellRenderer } from './hooks/useCellRenderer'

/**
 * Internal hook used by RecyclerList.
 * This is a thin alias over useCellRenderer.
 *
 * Exists only to keep RecyclerList internals clean and
 * allow future internal divergence without breaking public API.
 *
 * FlashList pattern: internal indirection layer.
 */
export function useRecyclerListInternal(
  layouts: readonly LayoutRectangle[],
  metrics: ScrollMetrics,
  bufferPx: number,
  getItemType: (index: number) => string
): readonly Cell[] {
  return useCellRenderer(
    layouts,
    metrics,
    bufferPx,
    getItemType
  )
}
