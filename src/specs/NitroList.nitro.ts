import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Represents the physical area an item occupies on the screen.
 * Standard: 'Layout' suffix tells the user this is a data object, not a logic object.
 */
export interface ItemLayout {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

/**
 * The high-performance layout engine for NitroList.
 * This interface will be used by Nitro to generate your Swift and Kotlin code.
 */
export interface NitroList
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {

  /**
   * Calculates exactly where every item should sit on the screen.
   * Standard: Use descriptive parameter names so developers know what to provide.
   */
  computeLayout(
    containerWidth: number,
    itemHeights: readonly number[]
  ): readonly ItemLayout[]
}