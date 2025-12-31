package com.nitrolist

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.margelo.nitro.nitrolist.views.HybridRecyclerListViewManager

class NitroListPackage : ReactPackage {

  override fun createNativeModules(
    reactContext: ReactApplicationContext
  ): List<NativeModule> {
    // Nitro uses ViewManagers, no NativeModules needed
    return emptyList()
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> {
    return listOf(
      HybridRecyclerListViewManager()
    )
  }
}
