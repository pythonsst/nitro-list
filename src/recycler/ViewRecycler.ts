import type { ViewSlot } from "./ViewSlot"

export class ViewRecycler {
  private readonly activeSlots = new Map<number, ViewSlot>()
  private readonly reusableSlots = new Map<string, ViewSlot[]>()
  private readonly orderedSlots: ViewSlot[] = []
  private nextId = 0

  reconcile(
    visibleIndices: readonly number[],
    getItemType: (index: number) => string
  ): readonly ViewSlot[] {
    const visibleSet = new Set(visibleIndices)

    // 1️⃣ Release unused
    for (const [index, slot] of this.activeSlots) {
      if (visibleSet.has(index)) continue

      this.activeSlots.delete(index)
      this.orderedSlots.splice(this.orderedSlots.indexOf(slot), 1)

      const pool = this.reusableSlots.get(slot.type) ?? []
      pool.push(slot)
      this.reusableSlots.set(slot.type, pool)
    }

    // 2️⃣ Acquire needed
    for (const index of visibleIndices) {
      if (this.activeSlots.has(index)) continue

      const type = getItemType(index)
      const pool = this.reusableSlots.get(type)
      let slot = pool?.pop()

      if (!slot) {
        slot = { key: `slot-${this.nextId++}`, type, index }
      }

      slot.index = index
      this.activeSlots.set(index, slot)
      this.orderedSlots.push(slot)
    }

    return this.orderedSlots
  }
}
