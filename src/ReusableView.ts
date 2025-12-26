// src/ReusableView.ts

export type ReusableView = {
  /** Stable identity for React */
  readonly key: string

  /** Current data index bound to this slot */
  index: number

  /** Optional type (header, row, etc — future) */
  type?: string
}
