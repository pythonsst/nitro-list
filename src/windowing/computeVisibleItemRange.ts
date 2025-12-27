import type { VisibleRange } from '../types/VisibleRange'
import type { VisibleRangeInput } from '../types/VisibleRangeInput'

/**
 * Computes the visible item index range using binary search.
 *
 * Responsibilities:
 * - Determine which items intersect the visible window
 * - Stay independent of rendering and recycling
 *
 * Performance:
 * - O(log n) to locate the first visible item
 * - O(k) to expand to the last visible item (k = visible count)
 */
export function computeVisibleItemRange(
  input: VisibleRangeInput
): VisibleRange | null {
  const {
    layouts,
    offset,
    viewportSize,
    buffer,
    isVertical,
  } = input

  const itemCount = layouts.length
  if (itemCount === 0) return null

  const windowStart = Math.max(0, offset - buffer)
  const windowEnd = offset + viewportSize + buffer

  // --------------------------------------------------
  // Binary search:
  // First item whose END >= windowStart
  // --------------------------------------------------
  let low = 0
  let high = itemCount - 1
  let firstVisibleIndex = itemCount

  while (low <= high) {
    const mid = (low + high) >>> 1
    const rect = layouts[mid]!

    const start = isVertical ? rect.y : rect.x
    const size = isVertical ? rect.height : rect.width
    const end = start + size

    if (end >= windowStart) {
      firstVisibleIndex = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  if (firstVisibleIndex === itemCount) {
    return null
  }

  // --------------------------------------------------
  // Linear scan forward:
  // Last item whose START <= windowEnd
  // --------------------------------------------------
  let lastVisibleIndex = firstVisibleIndex

  for (let i = firstVisibleIndex + 1; i < itemCount; i++) {
    const rect = layouts[i]!
    const start = isVertical ? rect.y : rect.x

    if (start > windowEnd) break
    lastVisibleIndex = i
  }

  return {
    startIndex: firstVisibleIndex,
    endIndex: lastVisibleIndex,
  }
}
