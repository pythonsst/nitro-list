import type { Cell } from './Cell'
import { createCell } from './createCell'

export class CellRecycler {
  /**
   * Active cells mapped by logical index.
   */
  private readonly indexToCell = new Map<number, Cell>()

  /**
   * Recycled cells grouped by type.
   */
  private readonly recycledByType = new Map<string, Cell[]>()

  reconcileRange(
    startIndex: number,
    endIndex: number,
    resolveCellType: (index: number) => string
  ): readonly Cell[] {
    const nextActive: Cell[] = []

    // Mark all current cells as unused
    for (const cell of this.indexToCell.values()) {
      cell.index = -1
    }

    for (let index = startIndex; index <= endIndex; index++) {
      let cell = this.indexToCell.get(index)

      if (cell) {
        cell.index = index
        nextActive.push(cell)
        continue
      }

      const type = resolveCellType(index)
      const pool = this.recycledByType.get(type)

      if (pool && pool.length > 0) {
        cell = pool.pop()!
      } else {
        cell = createCell(type)
      }

      cell.index = index
      this.indexToCell.set(index, cell)
      nextActive.push(cell)
    }

    // Recycle cells no longer in use
    for (const [index, cell] of this.indexToCell) {
      if (cell.index !== index) {
        this.indexToCell.delete(index)

        let pool = this.recycledByType.get(cell.type)
        if (!pool) {
          pool = []
          this.recycledByType.set(cell.type, pool)
        }

        pool.push(cell)
      }
    }

    return nextActive
  }
}
