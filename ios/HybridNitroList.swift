import Foundation
import NitroModules

/**
 * Native layout engine for RecyclerList.
 * Pure, deterministic, synchronous computation.
 */
final class HybridNitroList: HybridNitroListSpec {

  func computeLayout(
    containerWidth: Double,
    itemHeights: [Double]
  ) -> [ItemLayout] { // Changed from LayoutRect to ItemLayout

    var layouts: [ItemLayout] = [] // Changed from LayoutRect to ItemLayout
    layouts.reserveCapacity(itemHeights.count)

    var currentY: Double = 0

    for height in itemHeights {
      layouts.append(
        ItemLayout( // This now matches the generated struct name
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
  
  // Don't forget to update getVisibleRange to use ItemLayout if it references it!
}