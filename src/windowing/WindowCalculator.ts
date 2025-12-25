import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { Viewport } from './Viewport'
import { getVisibleRange } from './BinarySearchWindow'

export type WindowResult = {
  readonly indices: readonly number[]
}

export function calculateWindow(
  layouts: readonly LayoutRectangle[],
  viewport: Viewport,
  bufferPx: number
): WindowResult {
  return {
    indices: getVisibleRange(layouts, viewport, bufferPx),
  }
}
