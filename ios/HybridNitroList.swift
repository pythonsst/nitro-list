import Foundation
import NitroModules

/**
 * Native layout engine for RecyclerList.
 * Pure, deterministic, synchronous computation.
 */
final class HybridNitroLayoutEngine: HybridNitroLayoutEngineSpec {

  func computeLayout(
    containerWidth: Double,
    itemHeights: [Double]
  ) -> [LayoutRect] {

    var layouts: [LayoutRect] = []
    layouts.reserveCapacity(itemHeights.count)

    var currentY: Double = 0

    for height in itemHeights {
      layouts.append(
        LayoutRect(
          x: 0,
          y: currentY,
          width: containerWidth,
          height: height
        )
      )
      currentY += height
    }

    return layouts
  }
}
