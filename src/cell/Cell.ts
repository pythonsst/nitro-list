/**
 * Physical reusable cell.
 * Represents a single mounted view instance.
 */
export interface Cell {
  /**
   * Stable physical identity.
   * Used as React key. NEVER changes.
   */
  readonly key: string

  /**
   * Logical data index currently bound.
   * Changes as the cell is recycled.
   */
  index: number

  /**
   * Compatibility type (row, header, etc).
   * Determines reuse eligibility.
   */
  readonly type: string
}
