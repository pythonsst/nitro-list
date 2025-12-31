package com.nitrolist

import android.content.Context
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.margelo.nitro.nitrolist.HybridRecyclerListViewSpec

/**
 * Correct Nitro HybridView implementation.
 * Matches generated Spec EXACTLY.
 */
class HybridRecyclerListView(
  context: Context
) : HybridRecyclerListViewSpec() {

  // ---- Real Android View ----
  private val recyclerView = RecyclerView(context).apply {
    layoutManager = LinearLayoutManager(context)
    itemAnimator = null
    setHasFixedSize(true)
  }

  // ---- REQUIRED by HybridView ----
  override val view: View
    get() = recyclerView

  // ---- REQUIRED abstract props ----
  override var containerCrossAxisSize: Double = 0.0
  override var containerMainAxisSize: Double = 0.0
  override var contentSize: Double = 0.0

  // ---- Lifecycle hooks from HybridView ----
  override fun beforeUpdate() {
    // no-op for now
  }

  override fun afterUpdate() {
    // no-op for now
  }
}
