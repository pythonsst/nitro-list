// src/specs/nitro-list.nitro.ts

import { type HybridObject } from 'react-native-nitro-modules';

export interface LayoutRectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Native layout engine for RecyclerList.
 * Computes absolute item geometry in a single synchronous pass.
 */
export interface NitroList extends HybridObject<{ ios: 'swift' }> {
  /**
   * Calculates the position of every item synchronously.
   *
   * @param containerWidth Width of the list container (px)
   * @param itemHeights    Heights of all items (immutable)
   */
  computeLayout(
    containerWidth: number,
    itemHeights: readonly number[]
  ): readonly LayoutRectangle[];
}
