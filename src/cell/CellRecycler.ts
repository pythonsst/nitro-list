import type { Cell } from './Cell'

const MAX_CELLS = 40

/**
 * Owns physical cell reuse.
 * Stateful, imperative, React-agnostic.
 *
 * FlashList equivalent: CellRecycler
 */
export class CellRecycler {
  private readonly activeCells = new Map<number, Cell>()
  private readonly reusableCellsByType = new Map<string, Cell[]>()
  private readonly orderedCells: Cell[] = []
  private nextCellId = 0

  /**
   * Reconcile visible indices against existing cells.
   * Returns a stable ordered snapshot.
   */
  reconcile(
    visibleIndices: readonly number[],
    getCellType: (index: number) => string
  ): readonly Cell[] {
    const visibleSet = new Set(visibleIndices)

    // 1️⃣ Release cells no longer visible
    for (const [index, cell] of this.activeCells) {
      if (visibleSet.has(index)) continue

      this.activeCells.delete(index)

      const orderedIndex = this.orderedCells.indexOf(cell)
      if (orderedIndex !== -1) {
        this.orderedCells.splice(orderedIndex, 1)
      }

      const pool = this.reusableCellsByType.get(cell.type) ?? []
      if (pool.length < MAX_CELLS) pool.push(cell)
      this.reusableCellsByType.set(cell.type, pool)
    }

    // 2️⃣ Acquire cells for newly visible indices
    for (const index of visibleIndices) {
      if (this.activeCells.has(index)) continue

      const type = getCellType(index)
      const pool = this.reusableCellsByType.get(type)
      let cell = pool?.pop()

      if (!cell) {
        cell = {
          key: `cell-${this.nextCellId++}`,
          type,
          index,
        }
      }

      cell.index = index
      this.activeCells.set(index, cell)
      this.orderedCells.push(cell)
    }

    return this.orderedCells
  }
}
