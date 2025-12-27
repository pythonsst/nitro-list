/**
 * Logical cell type.
 *
 * Used to group compatible cells for recycling.
 *
 * Cross-platform equivalent:
 * - Android: viewType
 * - iOS: reuseIdentifier
 *
 * NOTE:
 * This is a branded type to prevent accidental mixing
 * with keys, indexes, or other strings/numbers.
 */
export type CellType = string & {
  readonly __cellTypeBrand: unique symbol
}

/**
 * Helper to create a CellType safely.
 * Keeps ergonomics simple for users.
 */
export const createCellType = (
  value: string
): CellType => value as CellType
