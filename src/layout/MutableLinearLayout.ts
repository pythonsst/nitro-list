import type { LayoutRectangle } from './LayoutRectangle'

/**
 * INTERNAL mutable layout record.
 * This is intentionally mutable and never exposed publicly.
 */
type MutableLayoutRectangle = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Mutable linear layout store.
 * FlashList-style incremental relayout.
 */
export class MutableLinearLayout {
  private readonly layouts: MutableLayoutRectangle[]
  private totalHeight: number

  constructor(
    initialHeights: readonly number[],
    width: number
  ) {
    this.layouts = []
    let y = 0

    for (const height of initialHeights) {
      this.layouts.push({
        x: 0,
        y,
        width,
        height,
      })
      y += height
    }

    this.totalHeight = y
  }

  /**
   * Read-only snapshot for consumers.
   * Returned type is immutable.
   */
  getLayouts(): readonly LayoutRectangle[] {
    return this.layouts
  }

  getContentHeight(): number {
    return this.totalHeight
  }

  /**
   * Update height of one item and shift following items.
   * Returns true if layout changed.
   */
  updateItemHeight(
    index: number,
    newHeight: number
  ): boolean {
    const layout = this.layouts[index]
    if (!layout) return false

    const delta = newHeight - layout.height
    if (delta === 0) return false

    // Update this item
    layout.height = newHeight

    // Shift all items after this index
    for (let i = index + 1; i < this.layouts.length; i++) {
      this.layouts[i]!.y += delta
    }

    this.totalHeight += delta
    return true
  }
}
