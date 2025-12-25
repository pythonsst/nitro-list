import type { LayoutRectangle } from '../layout/LayoutRectangle'

export function getVisibleRange(
  layouts: readonly LayoutRectangle[],
  offsetY: number,
  viewportHeight: number,
  bufferPx: number
): readonly number[] {
  if (layouts.length === 0) return []

  const startY = Math.max(0, offsetY - bufferPx)
  const endY = offsetY + viewportHeight + bufferPx

  let low = 0
  let high = layouts.length - 1
  let firstVisible = layouts.length

  // Binary search: first item whose bottom >= startY
  while (low <= high) {
    const mid = (low + high) >> 1
    const rect = layouts[mid]! // safe

    if (rect.y + rect.height >= startY) {
      firstVisible = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  const visible: number[] = []

  // Linear scan forward until endY
  for (let i = firstVisible; i < layouts.length; i++) {
    const rect = layouts[i]! // safe
    if (rect.y > endY) break
    visible.push(i)
  }

  return visible
}
