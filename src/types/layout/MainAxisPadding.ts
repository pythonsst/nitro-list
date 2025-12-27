/**
 * Padding applied along the main scroll axis.
 *
 * This is a layout-level concept (not visual styling).
 *
 * - vertical   → top / bottom
 * - horizontal → left / right
 *
 * Uses start/end to remain RTL-safe and platform-neutral.
 */
export interface MainAxisPadding {
  readonly start: number
  readonly end: number
}

/**
 * Shared zero-padding constant.
 * Safe to reuse across layouts.
 */
export const ZERO_MAIN_AXIS_PADDING: MainAxisPadding = {
  start: 0,
  end: 0,
}
