import React, { useMemo } from 'react'
import { ScrollView, View } from 'react-native'
import type { ReactElement } from 'react'

import type { RecyclerListProps } from './RecyclerList.types'
import type { LayoutRectangle } from './layout/LayoutRectangle'

import { computeLinearLayout } from './layout/LayoutEngine'
import { useScrollEvents } from './hooks/useScrollEvents'
import { useRecyclerList } from './hooks/useRecyclerList'

/**
 * Safe helper — TS & runtime correct
 */
function getLastLayout(
  layouts: readonly LayoutRectangle[]
): LayoutRectangle | null {
  const len = layouts.length
  if (len === 0) return null

  const last = layouts[len - 1]
  return last ?? null
}

export function RecyclerList({
  containerWidth,
  itemCount,
  itemHeights,
  estimatedItemHeight = 80,
  renderBufferRatio = 1.3,
  getItemType = () => 'default',
  renderItem,
}: RecyclerListProps): ReactElement {
  /**
   * Resolve item heights
   */
  const resolvedHeights = useMemo<readonly number[]>(() => {
    if (itemHeights) return itemHeights
    if (itemCount == null) return []
    return Array.from({ length: itemCount }, () => estimatedItemHeight)
  }, [itemHeights, itemCount, estimatedItemHeight])

  /**
   * Compute layouts once
   */
  const layouts = useMemo<readonly LayoutRectangle[]>(() => {
    if (resolvedHeights.length === 0) return []
    return computeLinearLayout(containerWidth, resolvedHeights)
  }, [containerWidth, resolvedHeights])

  /**
   * Scroll → viewport
   */
  const { viewport, onScroll, onLayout } = useScrollEvents()

  /**
   * Buffer in px
   */
  const bufferPx = viewport.height * renderBufferRatio

  /**
   * Recycler slots
   */
  const slots = useRecyclerList(layouts, viewport, bufferPx, getItemType)

  /**
   * Total scrollable height (TS-safe)
   */
  const contentHeight = useMemo(() => {
    const last = getLastLayout(layouts)
    return last ? last.y + last.height : 0
  }, [layouts])

  return (
    <ScrollView
      onLayout={onLayout}
      scrollEventThrottle={16}
      onScroll={onScroll}
      removeClippedSubviews
    >
      <View style={{ height: contentHeight }}>
        {slots.map((slot) => {
          const layout = layouts[slot.index]
          if (!layout) return null

          return (
            <View
              key={slot.key}
              style={{
                position: 'absolute',
                top: layout.y,
                left: 0,
                width: layout.width,
                height: layout.height,
              }}
            >
              {renderItem(slot.index)}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
