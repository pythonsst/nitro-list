import UIKit
import NitroModules

final class HybridRecyclerListView:
  HybridRecyclerListViewSpec_base,
  HybridRecyclerListViewSpec_protocol
{
  private let scrollView = UIScrollView()

  required override init() {
    super.init()
    print("[RecyclerListView native] INIT")

    scrollView.alwaysBounceVertical = true
    scrollView.showsVerticalScrollIndicator = true
  }

  // MARK: - Props

  var containerCrossAxisSize: Double = 0 {
    didSet { updateLayout() }
  }

  var containerMainAxisSize: Double = 0 {
    didSet { updateLayout() }
  }

  var contentSize: Double = 0 {
    didSet { updateLayout() }
  }

  // MARK: - HybridView
  // React Native controls layout

  var view: UIView {
    return scrollView
  }

  // MARK: - Layout
  // 🔥 DO NOT SET FRAME

  private func updateLayout() {
    scrollView.contentSize = CGSize(
      width: CGFloat(containerCrossAxisSize),
      height: CGFloat(contentSize)
    )

    print("""
    [RecyclerListView native layout]
      bounds: \(scrollView.bounds)
      contentSize: \(scrollView.contentSize)
    """)
  }
}
