import type { CellType } from '../CellType'
import type { CellKey } from '../CellKey'

/**
 * Public contract for a physical recycler cell.
 * Key type MUST be generic / opaque.
 */
export interface RecyclerCell<K = CellKey> {
  readonly key: K
  readonly type: CellType
  index: number
}
