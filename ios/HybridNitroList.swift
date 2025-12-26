import Foundation
import NitroModules

/**
 * Native layout engine for RecyclerList.
 * Pure, deterministic, synchronous computation.
 */
final class HybridNitroList: HybridNitroListSpec {

  /**
   * Computes absolute layout rectangles for all items.
   * Called synchronously via JSI.
   */
  func computeLayout(
    containerWidth: Double,
    itemHeights: [Double]
  ) -> [LayoutRectangle] {

    var layouts: [LayoutRectangle] = []
    layouts.reserveCapacity(itemHeights.count)

    var currentY: Double = 0

    for height in itemHeights {
      let rect = LayoutRectangle(
        x: 0,
        y: currentY,
        width: containerWidth,
        height: height
      )

      layouts.append(rect)
      currentY += height
    }

    return layouts
  }
}
