import type { HybridObject } from 'react-native-nitro-modules'

export interface LayoutRect {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface NitroLayoutEngine
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {

  computeLayout(
    containerWidth: number,
    itemHeights: readonly number[]
  ): readonly LayoutRect[]
}
