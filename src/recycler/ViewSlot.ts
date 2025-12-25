// recycler/ViewSlot.ts
export interface ViewSlot {
  /** Stable physical identity */
  readonly key: string

  /** Slot compatibility type */
  readonly type: string

  /** Current data index */
  index: number
}
