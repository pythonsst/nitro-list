import type { CellType } from "../CellType"


export type RecyclerCellInstance = {
  readonly key: number
  index: number
  readonly type: CellType
}

export type RecyclerListProps<T> = {
  data: readonly T[]
  renderItem: (args: {
    item: T
    index: number
    cell: RecyclerCellInstance
  }) => React.ReactNode

  getCellType: (item: T, index: number) => CellType

  scrollDirection?: 'vertical' | 'horizontal'
  bufferRatio?: number

  containerCrossAxisSize: number
  itemMainAxisSizes: readonly number[]

  padding?: { start: number; end: number }
  itemSpacing?: number
}
