import type React from 'react'

export type RecyclerListProps = {
  /** Width of the list container (required) */
  readonly containerWidth: number

  /** Total number of items (used with estimatedItemHeight) */
  readonly itemCount?: number

  /** Explicit item heights (fast path, skips estimation) */
  readonly itemHeights?: readonly number[]

  /** Estimated item height when itemHeights not provided */
  readonly estimatedItemHeight?: number

  /** Render buffer multiplier (FlashList-style, default ~1.3) */
  readonly renderBufferRatio?: number

  /** Optional item type resolver for recycling */
  readonly getItemType?: (index: number) => string

  /** Render function */
  readonly renderItem: (index: number) => React.ReactElement
}
