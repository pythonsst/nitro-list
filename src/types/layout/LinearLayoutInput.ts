import type { MainAxisPadding } from './MainAxisPadding'

export interface LinearLayoutInput {
  readonly crossAxisSize: number
  readonly itemMainAxisSizes: readonly number[]

  /** Padding before/after content (main axis) */
  readonly padding: MainAxisPadding

  /** Space BETWEEN items (main axis) */
  readonly itemSpacing?: number
}
