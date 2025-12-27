import type { Axis } from '../types/Axis'
import type { LinearLayoutInput } from '../types/layout'
import type { LayoutRect } from '../types/layout/LayoutRect'
import { DEFAULT_ITEM_SPACING } from './constants/layoutDefaults'


/**
 * Mutable, deterministic linear layout engine.
 *
 * Responsibilities:
 * - Compute absolute item geometry
 * - Own layout truth (no React, no scroll state)
 * - Guarantee monotonic ordering along the main axis
 *
 * Cross-platform equivalents:
 * - Flutter: RenderSliver / SliverList
 * - Android: LinearLayoutManager
 * - iOS: UICollectionViewFlowLayout (linear)
 */
export class MutableLinearLayout {
  private readonly isVertical: boolean

  /** Absolute item layouts in index order */
  private layouts: LayoutRect[] = []

  /** Total scrollable size along main axis */
  private contentSize = 0

  constructor(axis: Axis) {
    this.isVertical = axis === 'vertical'
  }

  /**
   * Computes layout synchronously from input.
   *
   * This method is intentionally parameter-object based
   * to allow future extension without breaking API.
   *
   * Invariants:
   * - Layouts are monotonic along main axis
   * - No gaps except explicit spacing
   * - Deterministic for identical inputs
   */
  compute(input: LinearLayoutInput): void {
    const {
      crossAxisSize,
      itemMainAxisSizes,
      padding,
      itemSpacing = DEFAULT_ITEM_SPACING,
    } = input

    const itemCount = itemMainAxisSizes.length
    const layouts: LayoutRect[] = new Array(itemCount)

    let cursor = padding.start

    for (let i = 0; i < itemCount; i++) {
      const mainAxisSize = itemMainAxisSizes[i]!

      layouts[i] = this.isVertical
        ? {
            x: 0,
            y: cursor,
            width: crossAxisSize,
            height: mainAxisSize,
          }
        : {
            x: cursor,
            y: 0,
            width: mainAxisSize,
            height: crossAxisSize,
          }

      cursor += mainAxisSize

      // Space BETWEEN items, not after the last
      if (i < itemCount - 1) {
        cursor += itemSpacing
      }
    }

    this.layouts = layouts
    this.contentSize = cursor + padding.end
  }

  /**
   * Returns computed item layouts.
   *
   * Order is guaranteed monotonic along the main axis,
   * which is required for binary-search-based windowing.
   */
  getLayouts(): readonly LayoutRect[] {
    return this.layouts
  }

  /**
   * Returns total scrollable size along the main axis,
   * including padding and inter-item spacing.
   */
  getContentSize(): number {
    return this.contentSize
  }

  /**
   * Clears internal layout state.
   * Call on severe invalidation or teardown.
   */
  reset(): void {
    this.layouts = []
    this.contentSize = 0
  }
}
