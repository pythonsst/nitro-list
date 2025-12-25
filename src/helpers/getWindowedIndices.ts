import type { LayoutRectangle } from "../layout/LayoutRectangle"


export function getWindowedIndices(
  layouts: readonly LayoutRectangle[],
  contentOffsetY: number,
  viewportHeight: number,
  renderBufferPx: number
): number[] {
  const itemCount = layouts.length

  if (itemCount === 0) {
    return []
  }

  const windowTop = contentOffsetY - renderBufferPx
  const windowBottom =
    contentOffsetY + viewportHeight + renderBufferPx

  let low = 0
  let high = itemCount - 1
  let startIndex: number | null = null

  // ---- Binary search ----
  while (low <= high) {
    const mid = (low + high) >>> 1

    const rect = layouts[mid]
    if (!rect) {
      // Impossible in practice, but required for type safety
      break
    }

    const rectBottom = rect.y + rect.height

    if (rectBottom >= windowTop) {
      startIndex = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  if (startIndex === null) {
    return []
  }

  // ---- Forward scan ----
  const indices: number[] = []

  for (let i = startIndex; i < itemCount; i++) {
    const rect = layouts[i]
    if (!rect) {
      break
    }

    if (rect.y > windowBottom) {
      break
    }

    indices.push(i)
  }

  return indices
}
