import type { LayoutRectangle } from '../layout/LayoutRectangle'
import type { ScrollMetrics } from '../windowing/ScrollMetrics'

/**
 * Public token describing viewability state of an item.
 * Mirrors FlashList's ViewToken concept.
 */
export type ViewToken = {
  index: number
  isViewable: boolean
}

/**
 * Configuration for viewability calculations.
 */
export type ViewabilityConfig = {
  /**
   * Percentage (0–100) of item height that must be visible
   * for the item to be considered "viewable".
   */
  itemVisiblePercentThreshold?: number
}

/**
 * ViewabilityHelper
 *
 * Pure observer:
 * - Does NOT affect layout
 * - Does NOT affect recycling
 * - Computes visibility based on layout + scroll metrics
 *
 * This class is intentionally stateful (lastVisible)
 * to compute "changed" items efficiently.
 */
export class ViewabilityHelper {
  /** Previously visible indices */
  private lastVisible = new Set<number>()

  constructor(
    private readonly config: ViewabilityConfig = {}
  ) {}

  /**
   * Computes which items are viewable and which changed
   * since the last invocation.
   *
   * IMPORTANT:
   * - This method should be called AFTER windowing,
   *   not on the full dataset.
   */
  computeViewableItems(
    layouts: readonly LayoutRectangle[],
    metrics: ScrollMetrics
  ): {
    viewableItems: ViewToken[]
    changed: ViewToken[]
  } {
    const visibleNow = new Set<number>()
    const viewableItems: ViewToken[] = []
    const changed: ViewToken[] = []

    const viewportTop = metrics.offsetY
    const viewportBottom = viewportTop + metrics.height

    // Normalize threshold into [0, 1]
    const threshold =
      (this.config.itemVisiblePercentThreshold ?? 0) / 100

    /**
     * NOTE:
     * We intentionally iterate layouts sequentially,
     * but EXIT EARLY when items are completely below viewport.
     *
     * This keeps complexity near O(visibleItems),
     * not O(totalItems).
     */
    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i]!

      // If item is completely below viewport, stop
      if (layout.y > viewportBottom) {
        break
      }

      const itemTop = layout.y
      const itemBottom = layout.y + layout.height

      // If item is completely above viewport, skip
      if (itemBottom < viewportTop) {
        continue
      }

      // Compute visible intersection
      const visibleTop = Math.max(itemTop, viewportTop)
      const visibleBottom = Math.min(itemBottom, viewportBottom)

      const visibleHeight = Math.max(0, visibleBottom - visibleTop)

      // Guard against zero-height items
      const itemHeight =
        layout.height > 0 ? layout.height : 1

      const visibleRatio = visibleHeight / itemHeight

      if (visibleRatio >= threshold) {
        visibleNow.add(i)
        viewableItems.push({ index: i, isViewable: true })

        // Newly visible
        if (!this.lastVisible.has(i)) {
          changed.push({ index: i, isViewable: true })
        }
      }
    }

    /**
     * Items that were visible before but not anymore
     */
    for (const index of this.lastVisible) {
      if (!visibleNow.has(index)) {
        changed.push({ index, isViewable: false })
      }
    }

    // Update snapshot
    this.lastVisible = visibleNow

    return { viewableItems, changed }
  }
}
