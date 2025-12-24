//
//  HybridNitroList.swift
//  Pods
//
//  Created by Shiv Shankar Tiwari on 25/12/2025.
//

import Foundation
import UIKit

class HybridNitroList : HybridNitroListSpec {
  // UIView
  var view: UIView = UIView()

  // Props
  var isRed: Bool = false {
    didSet {
      view.backgroundColor = isRed ? .red : .black
    }
  }
}
