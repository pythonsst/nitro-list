import type { LayoutRect } from "../types/layout"


export type VisibleRange = {
  startIndex: number
  endIndex: number
}

type Input = {
  layouts: readonly LayoutRect[]
  offset: number
  viewportSize: number
  buffer: number
  isVertical: boolean
}

/**
 * Computes visible item range using binary search + forward scan.
 * Type-safe and defensive against invalid indices.
 */
export function computeVisibleItemRange(
  input: Input
): VisibleRange | null {
  const {
    layouts,
    offset,
    viewportSize,
    buffer,
    isVertical,
  } = input

  const count = layouts.length
  if (count === 0) return null

  const windowStart = Math.max(0, offset - buffer)
  const windowEnd = offset + viewportSize + buffer

  // ------------------------------
  // Binary search: first visible
  // ------------------------------
  let low = 0
  let high = count - 1
  let first = count

  while (low <= high) {
    const mid = (low + high) >>> 1
    const rect = layouts[mid]
    if (!rect) break

    const start = isVertical ? rect.y : rect.x
    const size = isVertical ? rect.height : rect.width

    if (start + size >= windowStart) {
      first = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  if (first === count) return null

  // ------------------------------
  // Linear scan: last visible
  // ------------------------------
  let last = first

  for (let i = first + 1; i < count; i++) {
    const rect = layouts[i]
    if (!rect) break

    const start = isVertical ? rect.y : rect.x
    if (start > windowEnd) break

    last = i
  }

  return {
    startIndex: first,
    endIndex: last,
  }
}
