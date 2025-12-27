import type { CellType } from "../CellType"
import type { RecyclerCell } from "./RecyclerCell"


/**
 * Owns recycled physical cells.
 * Enforces hard caps.
 */
export class CellPool<T extends RecyclerCell> {
  private readonly pools = new Map<CellType, T[]>()
  private readonly maxPerType = new Map<CellType, number>()

  hasType(type: CellType): boolean {
    return this.pools.has(type)
  }

  registerType(type: CellType, maxCount: number): void {
    if (this.pools.has(type)) return
    this.pools.set(type, [])
    this.maxPerType.set(type, maxCount)
  }

  acquire(type: CellType): T | null {
    const bucket = this.pools.get(type)
    if (!bucket || bucket.length === 0) return null
    return bucket.pop() ?? null
  }

  release(cell: T): void {
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
