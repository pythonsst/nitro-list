import React, {
  useMemo,
  useRef,
  useEffect,
} from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native'

import type { Cell } from './cell/Cell'
import type { LayoutRectangle } from './layout/LayoutRectangle'

import { useRecyclerListInternal } from './RecyclerList.internal'
import { useScrollMetrics } from './windowing'
import { MutableLinearLayout } from './layout/MutableLinearLayout'
import { ViewabilityHelper } from './viewability/ViewabilityHelper'
import { PrefetchHelper } from './prefetch/PrefetchHelper'

/**
 * Public API — mirrors FlashList behavior, not internals.
 */
export type RecyclerListProps = {
  containerWidth: number
  itemCount?: number
  itemHeights?: readonly number[]
  estimatedItemHeight?: number
  renderBufferRatio?: number
  getItemType?: (index: number) => string
  renderItem: (index: number) => React.ReactElement
  onPrefetch?: (indices: number[]) => void
  onViewableItemsChanged?: (info: {
    viewableItems: { index: number; isViewable: boolean }[]
    changed: { index: number; isViewable: boolean }[]
  }) => void
}

/**
 * FlashList invariant:
 * Never allow viewport height = 0 to gate windowing.
 */
const DEFAULT_VIEWPORT_HEIGHT = 800

export function RecyclerList(props: RecyclerListProps): React.ReactElement {
  const {
    containerWidth,
    itemCount,
    itemHeights,
    estimatedItemHeight = 80,
    renderBufferRatio = 1.3,
    getItemType = () => 'default',
    renderItem,
    onPrefetch,
    onViewableItemsChanged,
  } = props

  /**
   * 🚨 DEV WARNINGS ONLY (never throw in render!)
   */
  if (__DEV__) {
    if (!itemHeights && itemCount == null) {
      console.error(
        'RecyclerList requires either itemCount or itemHeights.'
      )
    }

    if (itemHeights && itemCount != null) {
      console.error(
        'Provide only one of itemCount or itemHeights.'
      )
    }
  }

  /**
   * STEP 1: Resolve item count safely (props only).
   * Never depend on hooks for structural decisions.
   */
  const itemLength =
    itemHeights?.length ??
    itemCount ??
    0

  /**
   * STEP 2: Resolve initial heights (always defined).
   */
  const resolvedHeights = useMemo<readonly number[]>(() => {
    if (itemHeights) return itemHeights

    return Array.from(
      { length: itemLength },
      () => estimatedItemHeight
    )
  }, [itemHeights, itemLength, estimatedItemHeight])

  /**
   * STEP 3: Mutable layout lifecycle.
   * Recreate layout only when shape changes.
   */
  const layoutRef = useRef<MutableLinearLayout | null>(null)
  const lastLayoutKeyRef = useRef<string | null>(null)

  const layoutKey = `${containerWidth}-${itemLength}`

  if (
    !layoutRef.current ||
    lastLayoutKeyRef.current !== layoutKey
  ) {
    layoutRef.current = new MutableLinearLayout(
      resolvedHeights,
      containerWidth
    )
    lastLayoutKeyRef.current = layoutKey
  }

  /**
   * STEP 4: Read layout snapshot.
   */
  const layouts: readonly LayoutRectangle[] =
    layoutRef.current.getLayouts()

  const contentHeight =
    layoutRef.current.getContentHeight()

  /**
   * STEP 5: Scroll metrics.
   */
  const {
    metrics,
    onScroll,
    onLayout,
  } = useScrollMetrics()

  /**
   * STEP 6: Guard initial windowing.
   */
  const effectiveViewportHeight =
    metrics.height > 0
      ? metrics.height
      : DEFAULT_VIEWPORT_HEIGHT

  const bufferPx =
    effectiveViewportHeight * renderBufferRatio

  /**
   * STEP 7: Windowing + recycling.
   */
  const cells: readonly Cell[] =
    useRecyclerListInternal(
      layouts,
      metrics,
      bufferPx,
      getItemType
    )

  /**
   * STEP 8: Phase-1 observers.
   */
  const viewabilityRef = useRef(
    new ViewabilityHelper({
      itemVisiblePercentThreshold: 50,
    })
  )

  const prefetchRef = useRef(
    new PrefetchHelper()
  )

  useEffect(() => {
    prefetchRef.current = new PrefetchHelper()
  }, [itemLength])

  useEffect(() => {
    if (metrics.height === 0) return

    if (onViewableItemsChanged) {
      const visibleLayouts: LayoutRectangle[] = []

      for (const cell of cells) {
        const layout = layouts[cell.index]
        if (layout) visibleLayouts.push(layout)
      }

      const info =
        viewabilityRef.current.computeViewableItems(
          visibleLayouts,
          metrics
        )

      onViewableItemsChanged(info)
    }

    if (onPrefetch && itemLength > 0) {
      prefetchRef.current.runPrefetch(
        cells.map(c => c.index),
        itemLength,
        5,
        onPrefetch
      )
    }
  }, [
    cells,
    metrics.offsetY,
    metrics.height,
    onViewableItemsChanged,
    onPrefetch,
    itemLength,
    layouts,
  ])

  /**
   * STEP 9: Render absolutely positioned cells.
   */
  return (
    <ScrollView
      style={styles.container}
      onLayout={onLayout}
      onScroll={onScroll}
      scrollEventThrottle={16}
      removeClippedSubviews
    >
      <View style={[styles.content, { height: contentHeight }]}>
        {cells.map(cell => {
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
  container: { flex: 1 },
  content: { position: 'relative', width: '100%' },
  cell: { position: 'absolute', left: 0 },
})
