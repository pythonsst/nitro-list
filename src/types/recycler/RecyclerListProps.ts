import type { Axis } from '../Axis'
import type { CellType } from '../CellType'
import type { MainAxisPadding } from '../layout'
import type { RecyclerItemRenderer } from './RecyclerItemRenderer'

/**
 * Public props for RecyclerList.
 *
 * Generic, data-driven, layout-deterministic API.
 * This surface is intentionally minimal and stable.
 */
export interface RecyclerListProps<T> {
  /**
   * Scroll direction.
   * Defaults to 'vertical'.
   */
  readonly scrollDirection?: Axis

  /**
   * Cross-axis size.
   * - vertical   → width
   * - horizontal → height
   *
   * Required for deterministic layout.
   */
  readonly containerCrossAxisSize: number

  /**
   * Data source.
   * Length is the single source of truth for item count.
   */
  readonly data: readonly T[]

  /**
   * Item sizes along the main axis.
   * Must match data length.
   *
   * - vertical   → heights
   * - horizontal → widths
   */
  readonly itemMainAxisSizes: readonly number[]

  /**
   * Padding before and after content along the main axis.
   *
   * Defaults are applied internally by the layout engine.
   */
  readonly padding?: MainAxisPadding

  /**
   * Space BETWEEN items along the main axis.
   *
   * Defaults are applied internally by the layout engine.
   */
  readonly itemSpacing?: number

  /**
   * Extra render buffer as a ratio of viewport size.
   * Used for overscan / pre-rendering.
   */
  readonly bufferRatio?: number

  /**
   * Logical cell type resolver.
   * Determines recycling compatibility.
   */
  readonly getCellType: (item: T, index: number) => CellType

  /**
   * Item renderer.
   * Receives stable cell identity and data.
   */
  readonly renderItem: RecyclerItemRenderer<T>
}
