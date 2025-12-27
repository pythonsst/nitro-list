import type { Cell } from './Cell'

let nextCellId = 0

/**
 * Creates a new physical cell with a stable identity.
 * The key is generated ONCE and never changes.
 */
export function createCell(type: string): Cell {
  return {
    key: `cell-${nextCellId++}`, // stable physical identity
    type,
    index: -1,                  // assigned by recycler
  }
}
