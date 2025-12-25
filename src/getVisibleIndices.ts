import type { LayoutRectangle } from './layout/LayoutRectangle'
import type { ScrollMetrics } from './windowing/ScrollMetrics'

/**
 * Binary-search based windowing.
 * Returns indices intersecting viewport ± buffer.
 */
export function getVisibleRange(
  layouts: readonly LayoutRectangle[],
  metrics: ScrollMetrics,
  bufferPx: number
): readonly number[] {
  if (
    layouts.length === 0 ||
    metrics.height <= 0
  ) {
    return []
  }

  const startY = Math.max(
    0,
    metrics.offsetY - bufferPx
  )

  const endY =
    metrics.offsetY + metrics.height + bufferPx

  let low = 0
  let high = layouts.length - 1
  let first = layouts.length

  while (low <= high) {
    const mid = (low + high) >> 1
    const rect = layouts[mid]!

    if (rect.y + rect.height >= startY) {
      first = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  const visible: number[] = []

  for (let i = first; i < layouts.length; i++) {
    const rect = layouts[i]!
    if (rect.y > endY) break
    visible.push(i)
  }

  return visible
}
