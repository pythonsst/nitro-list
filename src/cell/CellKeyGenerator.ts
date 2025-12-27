import type { CellKey } from '../types/CellKey'

/**
 * Monotonic key generator for physical cell instances.
 * Guarantees stable keys across the lifetime of the list.
 */
export class CellKeyGenerator {
  private nextId = 0

  next(): CellKey {
    return this.nextId++
  }

  reset(): void {
    this.nextId = 0
  }
}
