package com.nitrolist

import android.content.Context
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

/**
 * Native RecyclerView host.
 * This is a real Android RecyclerView – no Nitro codegen involved.
 */
class HybridNitroRecyclerView(context: Context) : RecyclerView(context) {

  init {
    layoutManager = LinearLayoutManager(context)
    itemAnimator = null
    setHasFixedSize(true)
  }

  fun setItemCount(count: Int) {
    if (adapter == null) {
      adapter = NitroRecyclerAdapter(count)
    } else {
      (adapter as NitroRecyclerAdapter).updateCount(count)
    }
  }
}
