import type { Cell } from './Cell'
import { createCell } from './createCell'

/**
 * Manages physical cell reuse.
 * Imperative and stateful by design.
 * This is NOT React code.
 */
export class CellRecycler {
  /**
   * Active cells mapped by logical index.
   */
  private readonly indexToCell = new Map<number, Cell>()

  /**
   * Pool of detached reusable cells.
   */
  private readonly recycledCells: Cell[] = []

  /**
   * Reconcile a contiguous visible index range
   * into a stable list of physical cells.
   *
   * HOT PATH:
   * - No index arrays
   * - Minimal allocations
   * - Deterministic
   */
  reconcileRange(
    startIndex: number,
    endIndex: number,
    resolveCellType: (index: number) => string
  ): readonly Cell[] {
    const nextActive: Cell[] = []

    // Track which current indices are no longer visible
    const unusedIndices = new Set(this.indexToCell.keys())

    for (let index = startIndex; index <= endIndex; index++) {
      unusedIndices.delete(index)

      let cell = this.indexToCell.get(index)
      if (cell) {
        // Existing assignment — reuse
        nextActive.push(cell)
        continue
      }

      const type = resolveCellType(index)

      // Try to reuse a recycled cell of same type
      const recycledIdx = this.recycledCells.findIndex(
        c => c.type === type
      )

      if (recycledIdx !== -1) {
        cell = this.recycledCells.splice(recycledIdx, 1)[0]!
      } else {
        cell = createCell(type)
      }

      cell.index = index
      this.indexToCell.set(index, cell)
      nextActive.push(cell)
    }

    // Recycle cells that left the visible window
    for (const index of unusedIndices) {
      const cell = this.indexToCell.get(index)!
      this.indexToCell.delete(index)
      this.recycledCells.push(cell)
    }

    return nextActive
  }
}
