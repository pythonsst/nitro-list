package com.nitrolist

import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView

class NitroRecyclerAdapter(
  private var itemCountInternal: Int
) : RecyclerView.Adapter<NitroRecyclerViewHolder>() {

  override fun onCreateViewHolder(
    parent: ViewGroup,
    viewType: Int
  ): NitroRecyclerViewHolder {
    val view = View(parent.context)
    return NitroRecyclerViewHolder(view)
  }

  override fun onBindViewHolder(
    holder: NitroRecyclerViewHolder,
    position: Int
  ) {
    // JS/Fabric will manage children later
  }

  override fun getItemCount(): Int = itemCountInternal

  fun updateCount(newCount: Int) {
    itemCountInternal = newCount
    notifyDataSetChanged()
  }
}
