import type { CellType } from '../types/CellType'
import type { RecyclerCellInstance } from '../types/recycler'

export class CellPool {
  private readonly pools = new Map<CellType, RecyclerCellInstance[]>()
  private readonly maxPerType = new Map<CellType, number>()

  /** ✅ NEW: check if a type is registered */
  hasType(type: CellType): boolean {
    return this.pools.has(type)
  }

  registerType(type: CellType, maxCount: number): void {
    if (this.maxPerType.has(type)) return
    this.maxPerType.set(type, maxCount)
    this.pools.set(type, [])
  }

  acquire(type: CellType): RecyclerCellInstance | null {
    const bucket = this.pools.get(type)
    if (!bucket || bucket.length === 0) return null
    return bucket.pop()!
  }

  release(cell: RecyclerCellInstance): void {
    const { type } = cell
    const bucket = this.pools.get(type)
    const max = this.maxPerType.get(type)

    if (!bucket || max === undefined) return

    cell.index = -1

    if (bucket.length >= max) return
    bucket.push(cell)
  }

  clear(): void {
    for (const bucket of this.pools.values()) {
      bucket.length = 0
    }
  }

  getPoolSize(type: CellType): number {
    return this.pools.get(type)?.length ?? 0
  }
}
