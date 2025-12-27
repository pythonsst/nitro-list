import React, {
  useRef,
  useEffect,
  useState,
} from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native'

import type {
  LayoutRect,
  VisibleRange,
} from '../types'

import { MutableLinearLayout } from '../layout/MutableLinearLayout'
import { computeVisibleItemRange } from '../windowing'
import { CellPool } from './CellPool'
import type {
  RecyclerCellInstance,
  RecyclerListProps,
} from '../types/recycler'

/* =========================================================
 * Constants (implementation only)
 * =======================================================*/

const DEFAULT_VIEWPORT_SIZE = 800
const SCROLL_EVENT_THROTTLE = 16

/* =========================================================
 * RecyclerList
 * =======================================================*/

export function RecyclerList<T>(
  props: RecyclerListProps<T>
): React.ReactElement {
  const {
    scrollDirection = 'vertical',
    containerCrossAxisSize,
    data,
    itemMainAxisSizes,
    padding = { start: 0, end: 0 },
    itemSpacing,               // ✅ IMPORTANT
    bufferRatio = 1.3,
    getCellType,
    renderItem,
  } = props

  const isVertical = scrollDirection === 'vertical'
  const itemCount = data.length

  /* -------------------------------------------------------
   * Minimal render invalidation
   * -----------------------------------------------------*/

  const [, forceRender] = useState(0)

  /* -------------------------------------------------------
   * Layout engine (pure, deterministic)
   * -----------------------------------------------------*/

  const layoutEngineRef = useRef<MutableLinearLayout | null>(null)
  const layoutSignatureRef = useRef<string>('')

  /**
   * ⚠️ Any value that affects layout geometry
   * MUST participate in this signature.
   */
  const layoutSignature = [
    scrollDirection,
    containerCrossAxisSize,
    itemCount,
    itemMainAxisSizes,          // reference identity
    padding.start,
    padding.end,
    itemSpacing ?? 'default',
  ].join('|')

  if (
    !layoutEngineRef.current ||
    layoutSignatureRef.current !== layoutSignature
  ) {
    const engine = new MutableLinearLayout(scrollDirection)

    engine.compute({
      crossAxisSize: containerCrossAxisSize,
      itemMainAxisSizes,
      padding,
      itemSpacing,              // ✅ PASSED TO ENGINE
    })

    layoutEngineRef.current = engine
    layoutSignatureRef.current = layoutSignature
  }

  const layouts: readonly LayoutRect[] =
    layoutEngineRef.current.getLayouts()

  const contentSize =
    layoutEngineRef.current.getContentSize()

  /* -------------------------------------------------------
   * Scroll metrics (refs only)
   * -----------------------------------------------------*/

  const scrollOffsetRef = useRef(0)
  const viewportSizeRef = useRef(DEFAULT_VIEWPORT_SIZE)

  /* -------------------------------------------------------
   * Recycling
   * -----------------------------------------------------*/

  const cellPoolRef = useRef(new CellPool())
  const activeCellsRef = useRef<RecyclerCellInstance[]>([])

  /** Stable physical identity generator */
  const nextCellKeyRef = useRef(0)

  const createCellInstance = (
    type: RecyclerCellInstance['type']
  ): RecyclerCellInstance => ({
    key: nextCellKeyRef.current++,
    index: -1,
    type,
  })

  /* -------------------------------------------------------
   * Visible cell coordinator
   * -----------------------------------------------------*/

  const updateVisibleCells = (): void => {
    const offset = scrollOffsetRef.current
    const viewportSize = viewportSizeRef.current
    const buffer = viewportSize * bufferRatio

    const visibleRange: VisibleRange | null =
      computeVisibleItemRange({
        layouts,
        offset,
        viewportSize,
        buffer,
        isVertical,
      })

    if (!visibleRange) {
      for (const cell of activeCellsRef.current) {
        cellPoolRef.current.release(cell)
      }
      activeCellsRef.current = []
      forceRender(v => v + 1)
      return
    }

    const nextActiveCells: RecyclerCellInstance[] = []

    for (
      let index = visibleRange.startIndex;
      index <= visibleRange.endIndex;
      index++
    ) {
      const item = data[index]
      if (item === undefined) continue

      const cellType = getCellType(item, index)

      let cell =
        cellPoolRef.current.acquire(cellType)

      if (!cell) {
        cell = createCellInstance(cellType)
      }

      cell.index = index
      nextActiveCells.push(cell)
    }

    // Release cells that fell out of range
    for (const cell of activeCellsRef.current) {
      if (!nextActiveCells.includes(cell)) {
        cellPoolRef.current.release(cell)
      }
    }

    activeCellsRef.current = nextActiveCells
    forceRender(v => v + 1)
  }

  /* -------------------------------------------------------
   * Scroll handlers (frame-gated)
   * -----------------------------------------------------*/

  const frameScheduledRef = useRef(false)

  const onScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ): void => {
    scrollOffsetRef.current =
      isVertical
        ? event.nativeEvent.contentOffset.y
        : event.nativeEvent.contentOffset.x

    if (frameScheduledRef.current) return
    frameScheduledRef.current = true

    requestAnimationFrame(() => {
      frameScheduledRef.current = false
      updateVisibleCells()
    })
  }

  const onLayout = (event: any): void => {
    viewportSizeRef.current =
      isVertical
        ? event.nativeEvent.layout.height
        : event.nativeEvent.layout.width

    updateVisibleCells()
  }

  /* -------------------------------------------------------
   * Initial mount
   * -----------------------------------------------------*/

  useEffect(() => {
    updateVisibleCells()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* -------------------------------------------------------
   * Render
   * -----------------------------------------------------*/

  return (
    <ScrollView
      onScroll={onScroll}
      onLayout={onLayout}
      horizontal={!isVertical}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      removeClippedSubviews
    >
      <View
        style={
          isVertical
            ? { height: contentSize }
            : { width: contentSize }
        }
      >
        {activeCellsRef.current.map(cell => {
          const index = cell.index
          const layout = layouts[index]
          const item = data[index]

          if (!layout || item === undefined) return null

          return (
            <View
              key={cell.key}
              style={[
                styles.cell,
                isVertical
                  ? {
                      top: layout.y,
                      height: layout.height,
                      width: layout.width,
                    }
                  : {
                      left: layout.x,
                      width: layout.width,
                      height: layout.height,
                    },
              ]}
            >
              {renderItem({ item, index, cell })}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

/* =========================================================
 * Styles
 * =======================================================*/

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
  },
})
