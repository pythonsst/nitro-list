import type { CellType } from '../types/CellType'
import type { RecyclerCellInstance } from '../types/recycler'

/**
 * Pool of recyclable physical cell instances, grouped by CellType.
 *
 * Responsibilities:
 * - Own physical instances
 * - Enforce type-safe reuse
 * - Provide O(1) acquire / release
 *
 * Cross-platform equivalent:
 * - Android: RecyclerView.RecycledViewPool
 * - iOS: UICollectionView reuse pool
 */
export class CellPool {
  private readonly pools: Map<CellType, RecyclerCellInstance[]> = new Map()

  /**
   * Acquire a reusable cell instance for the given type.
   * Returns null if no compatible instance is available.
   */
  acquire(type: CellType): RecyclerCellInstance | null {
    const bucket = this.pools.get(type)
    if (!bucket || bucket.length === 0) {
      return null
    }

    return bucket.pop() ?? null
  }

  /**
   * Release a cell instance back into the pool.
   * The cell MUST be detached from rendering before release.
   */
  release(cell: RecyclerCellInstance): void {
    const { type } = cell

    // Reset mutable binding state
    cell.index = -1

    let bucket = this.pools.get(type)
    if (!bucket) {
      bucket = []
      this.pools.set(type, bucket)
    }

    bucket.push(cell)
  }

  /**
   * Clears all recycled instances.
   * Call on data reset or major layout invalidation.
   */
  clear(): void {
    this.pools.clear()
  }

  /**
   * Returns the number of recycled instances for a given type.
   * Intended for debugging and instrumentation only.
   */
  getPoolSize(type: CellType): number {
    return this.pools.get(type)?.length ?? 0
  }
}
