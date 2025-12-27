import type { CellKey } from "../CellKey"
import type { CellType } from "../CellType"


/**
 * Physical reusable cell instance.
 *
 * Represents a single mounted view that can be rebound
 * to different data items as scrolling occurs.
 *
 * Cross-platform equivalent:
 * - Flutter: Element / RenderObject
 * - Android: ViewHolder
 * - iOS: UICollectionViewCell
 */
export interface RecyclerCellInstance {
  /**
   * Stable physical identity.
   *
   * Used as React key.
   * MUST remain constant for the lifetime of the instance.
   */
  readonly key: CellKey

  /**
   * Logical data index currently bound to this instance.
   *
   * This value changes as the cell is recycled.
   * - -1 may be used to indicate "unbound".
   */
  index: number

  /**
   * Logical compatibility type.
   *
   * Determines which instances can be reused together.
   * Instances with different types MUST NOT be reused.
   */
  readonly type: CellType
}
