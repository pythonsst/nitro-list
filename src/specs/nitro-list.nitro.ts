import { type HybridObject } from 'react-native-nitro-modules'

export interface LayoutRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * World-Class Logic Engine.
 * Pre-calculates the entire list blueprint in one native pass.
 */
export interface NitroList extends HybridObject<{ ios: 'swift', android: 'kotlin' }> {
  /**
   * Calculates the position of every item synchronously.
   */
  computeLayout(containerWidth: number, itemHeights: number[]): LayoutRectangle[];
  
  /** Test property for UI verification */
  isRed: boolean;
}