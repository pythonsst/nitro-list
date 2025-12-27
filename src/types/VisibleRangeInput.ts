import type { LayoutRect } from './layout/LayoutRect'

/**
 * Input required to compute the visible item range.
 *
 * Pure contract:
 * - No logic
 * - No platform assumptions
 * - Safe to share with native / tests
 */
export interface VisibleRangeInput {
  /**
   * Ordered, monotonic layouts along the main axis.
   * Required for binary search correctness.
   */
  readonly layouts: readonly LayoutRect[]

  /**
   * Scroll offset along the main axis.
   */
  readonly offset: number

  /**
   * Viewport size along the main axis.
   */
  readonly viewportSize: number

  /**
   * Extra buffer before and after the viewport.
   */
  readonly buffer: number

  /**
   * Axis selector.
   * true  → vertical
   * false → horizontal
   */
  readonly isVertical: boolean
}
