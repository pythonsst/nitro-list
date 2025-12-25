import type { LayoutRectangle } from './layout/LayoutRectangle'
import type { Viewport } from './windowing/Viewport'
import type { ViewSlot } from './recycler/ViewSlot'
import { useRecyclerList } from './hooks/useRecyclerList'

export function useRecyclerListInternal(
  layouts: readonly LayoutRectangle[],
  viewport: Viewport,
  bufferPx: number,
  getItemType: (index: number) => string
): readonly ViewSlot[] {
  return useRecyclerList(
    layouts,
    viewport,
    bufferPx,
    getItemType
  )
}
