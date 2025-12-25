import React, { useMemo } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native'

import type { LayoutRectangle } from './layout/LayoutRectangle'
import type { Cell } from './cell/Cell'

import { useRecyclerListInternal } from './RecyclerList.internal'
import { useScrollMetrics } from './windowing'

export type RecyclerListProps = {
  containerWidth: number
  itemCount?: number
  itemHeights?: readonly number[]
  estimatedItemHeight?: number
  renderBufferRatio?: number
  getItemType?: (index: number) => string
  renderItem: (index: number) => React.ReactElement
}

const DEFAULT_VIEWPORT_HEIGHT = 800 // 🔒 FlashList-style fallback

export function RecyclerList({
  containerWidth,
  itemCount,
  itemHeights,
  estimatedItemHeight = 80,
  renderBufferRatio = 1.3,
  getItemType = () => 'default',
  renderItem,
}: RecyclerListProps): React.ReactElement {
  /**
   * Resolve item heights
   */
  const resolvedHeights = useMemo<readonly number[]>(() => {
    if (itemHeights) return itemHeights
    if (itemCount == null) return []
    return Array.from({ length: itemCount }, () => estimatedItemHeight)
  }, [itemHeights, itemCount, estimatedItemHeight])

  /**
   * Compute linear layouts
   */
  const layouts = useMemo<readonly LayoutRectangle[]>(() => {
    let y = 0
    const result: LayoutRectangle[] = []

    for (let i = 0; i < resolvedHeights.length; i++) {
      const height = resolvedHeights[i]!
      result.push({
        x: 0,
        y,
        width: containerWidth,
        height,
      })
      y += height
    }

    return result
  }, [resolvedHeights, containerWidth])

  /**
   * Scroll metrics
   */
  const {
    metrics,
    onScroll,
    onLayout,
  } = useScrollMetrics()

  /**
   * 🔒 IMPORTANT FIX
   * Never allow height = 0 to control windowing
   */
  const effectiveHeight =
    metrics.height > 0
      ? metrics.height
      : DEFAULT_VIEWPORT_HEIGHT

  const bufferPx = effectiveHeight * renderBufferRatio

  /**
   * Resolve visible cells
   */
  const cells: readonly Cell[] = useRecyclerListInternal(
    layouts,
    metrics,
    bufferPx,
    getItemType
  )

  /**
   * Total scrollable height
   */
  const contentHeight = useMemo(() => {
    if (layouts.length === 0) return 0
    const last = layouts[layouts.length - 1]!
    return last.y + last.height
  }, [layouts])

  return (
    <ScrollView
      style={styles.container}
      onLayout={onLayout}
      onScroll={onScroll}
      scrollEventThrottle={16}
      removeClippedSubviews
    >
      <View style={[styles.content, { height: contentHeight }]}>
        {cells.map((cell) => {
          const layout = layouts[cell.index]
          if (!layout) return null

          return (
            <View
              key={cell.key}
              style={[
                styles.cell,
                {
                  top: layout.y,
                  width: layout.width,
                  height: layout.height,
                },
              ]}
            >
              {renderItem(cell.index)}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: 'relative',
    width: '100%',
  },
  cell: {
    position: 'absolute',
    left: 0,
  },
})
