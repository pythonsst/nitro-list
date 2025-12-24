import Foundation
import UIKit
import NitroModules

/**
 * World-class Swift implementation of the NitroList logic.
 */
class HybridNitroList : HybridNitroListSpec {
  // Container view for UI testing
  var view: UIView = UIView()

  var isRed: Bool = false {
    didSet {
      // Robust UI update ensuring the main thread is used to prevent crashes
      DispatchQueue.main.async {
        self.view.backgroundColor = self.isRed ? .red : .black
      }
    }
  }

  /**
   * The Layout Engine.
   * Calculates coordinates synchronously to prevent blank spaces during fast scrolling.
   */
  func computeLayout(containerWidth: Double, itemHeights: [Double]) throws -> [LayoutRectangle] {
    var layouts: [LayoutRectangle] = []
    var currentY: Double = 0
    
    for height in itemHeights {
        let rect = LayoutRectangle(
            x: 0,
            y: currentY,
            width: containerWidth,
            height: height
        )
        layouts.append(rect)
        // Stacking logic identical to FlashList's internal behavior
        currentY += height
    }
    
    return layouts
  }
}