import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { Viewport } from './Viewport'

/**
 * Computes the contiguous range of item indices that intersect
 * the viewport expanded by a pixel buffer.
 *
 * This is a PURE function:
 * - no allocations besides the returned array
 * - no side effects
 * - safe to call on every scroll frame
 *
 * FlashList equivalent: visible window calculation
 */
export function findVisibleIndexRange(
  layouts: readonly LayoutRectangle[],
  viewport: Viewport,
  bufferPx: number
): readonly number[] {
  const itemCount = layouts.length
  if (itemCount === 0) return []

  const windowStartY = Math.max(0, viewport.offsetY - bufferPx)
  const windowEndY = viewport.offsetY + viewport.height + bufferPx

  // 1️⃣ Binary search: first item whose bottom intersects window
  let low = 0
  let high = itemCount - 1
  let firstVisibleIndex = itemCount

  while (low <= high) {
    const mid = (low + high) >> 1
    const layout = layouts[mid]!

    if (layout.y + layout.height >= windowStartY) {
      firstVisibleIndex = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  // 2️⃣ Linear scan forward until window end
  const visibleIndices: number[] = []

  for (let index = firstVisibleIndex; index < itemCount; index++) {
    const layout = layouts[index]!
    if (layout.y > windowEndY) break
    visibleIndices.push(index)
  }

  return visibleIndices
}
