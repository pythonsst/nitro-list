// src/layout/LayoutEngine.ts
import type { LayoutRectangle } from './LayoutRectangle'

export function computeLinearLayout(
  containerWidth: number,
  itemHeights: readonly number[]
): readonly LayoutRectangle[] {
  const layouts: LayoutRectangle[] = []
  let currentY = 0

  for (const height of itemHeights) {
    // height is guaranteed to be number
    layouts.push({
      x: 0,
      y: currentY,
      width: containerWidth,
      height,
    })

    currentY += height
  }

  return layouts
}
