package com.nitrolist

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

/**
 * Standard ViewManager.
 * Fabric compatible, handwritten.
 */
class HybridNitroRecyclerViewManager :
  SimpleViewManager<HybridNitroRecyclerView>() {

  override fun getName(): String = "NitroRecyclerView"

  override fun createViewInstance(
    reactContext: ThemedReactContext
  ): HybridNitroRecyclerView {
    return HybridNitroRecyclerView(reactContext)
  }

  @ReactProp(name = "itemCount")
  fun setItemCount(
    view: HybridNitroRecyclerView,
    count: Int
  ) {
    view.setItemCount(count)
  }
}
