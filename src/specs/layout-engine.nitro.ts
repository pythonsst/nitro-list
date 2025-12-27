import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Represents the geometric bounds of a list item.
 */
export interface ItemLayout {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

/**
 * The core engine responsible for calculating list item positions.
 */
export interface LayoutEngine
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {

  /**
   * Computes the layout frames for a list of items based on a fixed container width.
   */
  computeLayout(
    containerWidth: number,
    itemHeights: readonly number[]
  ): readonly ItemLayout[]
}