import React, { useRef, useEffect, useState } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native'

import type { LayoutRect, VisibleRange } from '../types'
import type {
  RecyclerCellInstance,
  RecyclerListProps,
} from '../types/recycler'
import type { CellType } from '../types/CellType'

import { MutableLinearLayout } from '../layout/MutableLinearLayout'
import { computeVisibleItemRange } from '../windowing'
import { CellPool } from './CellPool'

/* =========================================================
 * Constants
 * =======================================================*/

const DEFAULT_VIEWPORT_SIZE = 800
const DEFAULT_ITEM_SIZE = 60
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
    itemSpacing,
    bufferRatio = 1.3,
    getCellType,
    renderItem,
  } = props

  const isVertical = scrollDirection === 'vertical'
  const itemCount = data.length

  /* -------------------------------------------------------
   * Controlled render
   * -----------------------------------------------------*/

  const [, forceRender] = useState(0)

  /* -------------------------------------------------------
   * Layout engine
   * -----------------------------------------------------*/

  const layoutEngineRef = useRef<MutableLinearLayout | null>(null)
  const layoutSignatureRef = useRef('')

  const layoutSignature = [
    scrollDirection,
    containerCrossAxisSize,
    itemCount,
    itemMainAxisSizes,
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
      itemSpacing,
    })
    layoutEngineRef.current = engine
    layoutSignatureRef.current = layoutSignature
  }

  const layouts: readonly LayoutRect[] =
    layoutEngineRef.current.getLayouts()

  const contentSize =
    layoutEngineRef.current.getContentSize()

  /* -------------------------------------------------------
   * Scroll metrics
   * -----------------------------------------------------*/

  const scrollOffsetRef = useRef(0)
  const viewportSizeRef = useRef(DEFAULT_VIEWPORT_SIZE)

  /* -------------------------------------------------------
   * Cell pool + physical cells
   * -----------------------------------------------------*/

  const cellPoolRef = useRef(new CellPool())
  const activeCellsRef = useRef<RecyclerCellInstance[]>([])
  const nextCellKeyRef = useRef(0)

  const createCell = (type: CellType): RecyclerCellInstance => ({
    key: nextCellKeyRef.current++,
    index: -1,
    type,
  })

  const MAX_CELLS = Math.ceil(
    (viewportSizeRef.current / DEFAULT_ITEM_SIZE) *
      bufferRatio
  ) + 2

  /* -------------------------------------------------------
   * Visible cell coordinator
   * -----------------------------------------------------*/

  const updateVisibleCells = (): void => {
    const offset = scrollOffsetRef.current
    const viewportSize = viewportSizeRef.current
    const buffer = viewportSize * bufferRatio

    const range: VisibleRange | null =
      computeVisibleItemRange({
        layouts,
        offset,
        viewportSize,
        buffer,
        isVertical,
      })

    if (!range) return

    const nextCells: RecyclerCellInstance[] = []
    const used = new Set<RecyclerCellInstance>()

    for (
      let index = range.startIndex;
      index <= range.endIndex;
      index++
    ) {
      const item = data[index]
      if (item === undefined) continue

      const type = getCellType(item, index)

      // Register type once, with hard cap
      if (!cellPoolRef.current.hasType(type)) {
        cellPoolRef.current.registerType(type, MAX_CELLS)
        for (let i = 0; i < MAX_CELLS; i++) {
          cellPoolRef.current.release(createCell(type))
        }
      }

      let cell = cellPoolRef.current.acquire(type)

      if (!cell) {
        const reuseIndex =
          activeCellsRef.current.findIndex(
            c => c.type === type
          )

        if (reuseIndex === -1) continue

        cell =
          activeCellsRef.current.splice(
            reuseIndex,
            1
          )[0]!
      }

      cell.index = index
      nextCells.push(cell)
      used.add(cell)
    }

    for (const cell of activeCellsRef.current) {
      if (!used.has(cell)) {
        cellPoolRef.current.release(cell)
      }
    }

    let changed =
      nextCells.length !== activeCellsRef.current.length

    if (!changed) {
      for (let i = 0; i < nextCells.length; i++) {
        if (nextCells[i] !== activeCellsRef.current[i]) {
          changed = true
          break
        }
      }
    }

    if (changed) {
      activeCellsRef.current = nextCells
      forceRender(v => v + 1)
    }
  }

  /* -------------------------------------------------------
   * Scroll handlers
   * -----------------------------------------------------*/

  const frameScheduledRef = useRef(false)

  const onScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ): void => {
    scrollOffsetRef.current = isVertical
      ? e.nativeEvent.contentOffset.y
      : e.nativeEvent.contentOffset.x

    if (frameScheduledRef.current) return
    frameScheduledRef.current = true

    requestAnimationFrame(() => {
      frameScheduledRef.current = false
      updateVisibleCells()
    })
  }

  const onLayout = (e: any): void => {
    viewportSizeRef.current = isVertical
      ? e.nativeEvent.layout.height
      : e.nativeEvent.layout.width

    updateVisibleCells()
  }

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
