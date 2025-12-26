/**
 * Physical reusable cell.
 * Mirrors FlashList's Cell abstraction.
 */
export interface Cell {
  /** Stable physical identity (never changes) */
  readonly key: string

  /** Logical data index currently bound */
  index: number

  /** Compatibility type (row, header, etc.) */
  readonly type: string
}
