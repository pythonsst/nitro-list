import UIKit
import NitroModules

final class HybridRecyclerListView:
  HybridRecyclerListViewSpec_base,
  HybridRecyclerListViewSpec_protocol
{
  // MARK: - Required init

  required override init() {
    super.init()
    scrollView.alwaysBounceVertical = true
    scrollView.addSubview(contentView)
  }

  // MARK: - Views

  private let scrollView = UIScrollView()
  private let contentView = UIView()

  // MARK: - Props (MUST match .nitro.ts EXACTLY)

  var containerCrossAxisSize: Double = 0 {
    didSet { updateLayout() }
  }

  var contentSize: Double = 0 {
    didSet { updateLayout() }
  }

  var scrollOffset: Double = 0 {
    didSet {
      scrollView.contentOffset.y = CGFloat(scrollOffset)
    }
  }

  // MARK: - HybridView requirement

  var view: UIView {
    scrollView
  }

  // MARK: - Lifecycle hooks

  func beforeUpdate() {}
  func afterUpdate() {}

  // MARK: - Layout

  private func updateLayout() {
    let width = CGFloat(containerCrossAxisSize)
    let height = CGFloat(contentSize)

    scrollView.frame.size.width = width
    scrollView.contentSize = CGSize(width: width, height: height)

    contentView.frame = CGRect(
      x: 0,
      y: 0,
      width: width,
      height: height
    )
  }
}
