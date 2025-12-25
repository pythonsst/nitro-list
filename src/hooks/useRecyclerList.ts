import { useRef, useMemo, useState, useEffect } from "react"
import type { LayoutRectangle } from "react-native"
import { ViewRecycler } from "../recycler/ViewRecycler"
import type { ViewSlot } from "../recycler/ViewSlot"
import type { Viewport } from "../windowing/Viewport"
import { getVisibleRange } from "../windowing/BinarySearchWindow"

export function useRecyclerList(
  layouts: readonly LayoutRectangle[],
  viewport: Viewport,
  bufferPx: number,
  getItemType: (index: number) => string
): readonly ViewSlot[] {
  const recyclerRef = useRef(new ViewRecycler())
  const { offsetY, height } = viewport

  const visibleIndices = useMemo(
    () => getVisibleRange(layouts, offsetY, height, bufferPx),
    [layouts, offsetY, height, bufferPx]
  )

  const [slots, setSlots] = useState<readonly ViewSlot[]>([])

  useEffect(() => {
    const next = recyclerRef.current.reconcile(
      visibleIndices,
      getItemType
    )

    // 🔒 FlashList-style commit guard
    setSlots(prev => {
      if (prev === next) return prev
      if (
        prev.length === next.length &&
        prev.every((s, i) => s === next[i])
      ) {
        return prev
      }
      return next
    })
  }, [visibleIndices, getItemType])

  return slots
}
