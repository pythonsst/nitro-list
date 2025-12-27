import type { ReactNode } from 'react'
import type { RecyclerCell } from './RecyclerCell'

/**
 * Public renderItem signature for RecyclerList.
 * Renderers receive a stable physical cell contract.
 */
export type RecyclerItemRenderer<T> = (params: {
  item: T
  index: number
  cell: RecyclerCell
}) => ReactNode
