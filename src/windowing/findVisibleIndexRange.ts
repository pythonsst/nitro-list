import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { ScrollMetrics } from './ScrollMetrics'

/**
 * Computes the contiguous range of item indices
 * intersecting the viewport expanded by bufferPx.
 *
 * PURE function. No allocations besides output.
 * FlashList-style windowing.
 */
export function findVisibleIndexRange(
  layouts: readonly LayoutRectangle[],
  metrics: ScrollMetrics,
  bufferPx: number
): readonly number[] {
  const count = layouts.length
  if (count === 0) return []

  const windowStart = Math.max(0, metrics.offsetY - bufferPx)
  const windowEnd = metrics.offsetY + metrics.height + bufferPx

  // Binary search for first intersecting item
  let low = 0
  let high = count - 1
  let firstVisible = count

  while (low <= high) {
    const mid = (low + high) >> 1
    const rect = layouts[mid]!

    if (rect.y + rect.height >= windowStart) {
      firstVisible = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  // Linear scan forward
  const visible: number[] = []

  for (let i = firstVisible; i < count; i++) {
    const rect = layouts[i]!
    if (rect.y > windowEnd) break
    visible.push(i)
  }

  return visible
}
