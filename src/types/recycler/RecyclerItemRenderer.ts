import type { ReactNode } from 'react'
import type { RecyclerCellInstance } from './RecyclerCellInstance'

export type RecyclerItemRenderer<T> = (params: {
  item: T
  index: number
  cell: RecyclerCellInstance
}) => ReactNode
