import type { LayoutRectangle } from './LayoutRectangle'

/**
 * Provides layout information for items.
 * FlashList equivalent: LayoutProvider
 */
export interface LayoutProvider {
  /**
   * Total number of items
   */
  getItemCount(): number

  /**
   * Layout rectangle for a given index
   */
  getLayout(index: number): LayoutRectangle
}
