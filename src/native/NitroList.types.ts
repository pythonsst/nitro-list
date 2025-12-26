import type { LayoutRectangle } from '../layout/LayoutRectangle'

/**
 * JS runtime interface backed by Nitro (JSI).
 * Must match native HybridNitroList exactly.
 */
export interface NitroList {
  computeLayout(
    containerWidth: number,
    itemHeights: readonly number[]
  ): readonly LayoutRectangle[]
}
