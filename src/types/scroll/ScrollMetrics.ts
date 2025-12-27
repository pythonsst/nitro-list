import type { Axis } from "../Axis"


/**
 * Scroll state snapshot.
 *
 * Pure data — no platform or React coupling.
 */
export interface ScrollMetrics {
  /** Scroll axis */
  readonly axis: Axis

  /** Offset along the main axis */
  readonly offset: number

  /** Viewport size along the main axis */
  readonly viewportSize: number
}
