import type { LayoutRect } from "../types/layout";


/**
 * JS runtime interface backed by Nitro (JSI).
 * Must match native HybridNitroList exactly.
 */
export interface NitroList {
  computeLayout(
    containerWidth: number,
    itemHeights: readonly number[]
  ): readonly LayoutRect[]
}
