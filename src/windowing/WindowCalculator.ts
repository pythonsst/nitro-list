import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { Viewport } from './Viewport'
import { getVisibleRange } from './BinarySearchWindow'

export function calculateWindow(
  layouts: readonly LayoutRectangle[],
  viewport: Viewport,
  bufferPx: number
): readonly number[] {
  const { offsetY, height } = viewport

  return getVisibleRange(layouts, offsetY, height, bufferPx)
}
