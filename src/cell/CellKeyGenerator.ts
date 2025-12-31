import type { CellKey } from "../types"

export class CellKeyGenerator {
  private nextId = 0

  next(): CellKey {
    return this.nextId++
  }

  reset(): void {
    this.nextId = 0
  }
}
