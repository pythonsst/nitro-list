/**
 * Absolute layout rectangle.
 *
 * Cross-platform equivalent of:
 * - Flutter: Rect
 * - Android: Rect
 * - iOS: CGRect
 */
export interface LayoutRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}
