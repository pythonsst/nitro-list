import type { CellType } from '../types/CellType'
import type { RecyclerCellInstance } from '../types/recycler'

export class CellPool {
  private readonly pools = new Map<CellType, RecyclerCellInstance[]>()
  private readonly maxPerType = new Map<CellType, number>()

  hasType(type: CellType): boolean {
    return this.pools.has(type)
  }

  registerType(type: CellType, maxCount: number): void {
    if (this.pools.has(type)) return
    this.pools.set(type, [])
    this.maxPerType.set(type, maxCount)
  }

  acquire(type: CellType): RecyclerCellInstance | null {
    const bucket = this.pools.get(type)
    if (!bucket || bucket.length === 0) return null
    return bucket.pop()!
  }

  release(cell: RecyclerCellInstance): void {
    const bucket = this.pools.get(cell.type)
    const max = this.maxPerType.get(cell.type)
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
}
