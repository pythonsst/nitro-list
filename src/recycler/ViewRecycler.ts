// recycler/ViewRecycler.ts
import type { ViewSlot } from './ViewSlot'

const MAX_SLOTS = 40

export class ViewRecycler {
  private readonly activeSlots = new Map<number, ViewSlot>()
  private readonly reusableSlots = new Map<string, ViewSlot[]>()
  private nextId = 0

  acquire(index: number, type: string): ViewSlot {
    // Reuse by type
    const pool = this.reusableSlots.get(type)
    let slot = pool?.pop()

    // Evict oldest if at cap
    if (!slot && this.activeSlots.size >= MAX_SLOTS) {
      const oldestKey = this.activeSlots.keys().next().value
      if (oldestKey !== undefined) {
        slot = this.activeSlots.get(oldestKey)
        this.activeSlots.delete(oldestKey)
      }
    }

    // Allocate new
    if (!slot) {
      slot = {
        key: `slot-${this.nextId++}`,
        type,
        index,
      }
    }

    slot.index = index
    this.activeSlots.set(index, slot)
    return slot
  }

  releaseUnused(visibleIndices: readonly number[]): void {
    const visibleSet = new Set(visibleIndices)

    for (const [index, slot] of this.activeSlots) {
      if (visibleSet.has(index)) continue

      this.activeSlots.delete(index)

      const pool =
        this.reusableSlots.get(slot.type) ?? []

      if (pool.length < MAX_SLOTS) {
        pool.push(slot)
        this.reusableSlots.set(slot.type, pool)
      }
    }
  }

  getActiveSlots(): readonly ViewSlot[] {
    return Array.from(this.activeSlots.values())
  }
}
