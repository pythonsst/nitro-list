import type { Axis } from "../Axis"
import type { CellType } from "../CellType"
import type { MainAxisPadding } from "../layout"
import type { RecyclerItemRenderer } from "./RecyclerItemRenderer"

export interface NitroListProps<T> {
  readonly scrollDirection?: Axis
  readonly containerCrossAxisSize: number
  readonly data: readonly T[]
  readonly itemMainAxisSizes: readonly number[]
  readonly padding?: MainAxisPadding
  readonly itemSpacing?: number
  readonly bufferRatio?: number
  readonly getCellType: (item: T, index: number) => CellType
  readonly renderItem: RecyclerItemRenderer<T>
}
