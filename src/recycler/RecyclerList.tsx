import React, { useRef, useEffect, useState } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type LayoutChangeEvent,
} from 'react-native'

import type { LayoutRect, VisibleRange } from '../types'
import type { RecyclerCell, RecyclerListProps } from '../types/recycler'
import type { CellType } from '../types/CellType'
import type { CellKey } from '../types/CellKey'

import { MutableLinearLayout } from '../layout/MutableLinearLayout'
import { computeVisibleItemRange } from '../windowing'
import { CellPool } from './CellPool'

/* ========================================================= */

const DEFAULT_VIEWPORT_SIZE = 800
const DEFAULT_ITEM_SIZE = 60
const SCROLL_EVENT_THROTTLE = 16

/* ========================================================= */
/* Internal (mutable) cell                                  */
/* ========================================================= */

interface InternalRecyclerCell extends RecyclerCell<CellKey> {
  active: boolean
}

/* ========================================================= */
/* RecyclerList                                             */
/* ========================================================= */

export function RecyclerList<T>(
  props: RecyclerListProps<T>
): React.ReactElement {
  const {
    data,
    renderItem,
    getCellType,
    scrollDirection = 'vertical',
    bufferRatio = 1.3,
    containerCrossAxisSize,
    itemMainAxisSizes,
    padding = { start: 0, end: 0 },
    itemSpacing,
  } = props

  const isVertical = scrollDirection === 'vertical'
  const [, forceRender] = useState(0)

  const DEBUG = true


  /* ======================================================= */
  /* Layout engine (recomputed when signature changes)       */
  /* ======================================================= */

  const layoutEngineRef = useRef<MutableLinearLayout | null>(null)
  const layoutSignatureRef = useRef<string>('')

  const layoutSignature = [
    scrollDirection,
    containerCrossAxisSize,
    data.length,
    itemMainAxisSizes,
    padding.start,
    padding.end,
    itemSpacing ?? 'none',
  ].join('|')

  if (
    layoutEngineRef.current === null ||
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

  const contentSize: number =
    layoutEngineRef.current.getContentSize()

  /* ======================================================= */
  /* Scroll metrics                                          */
  /* ======================================================= */

  const scrollOffsetRef = useRef<number>(0)
  const viewportSizeRef = useRef<number>(DEFAULT_VIEWPORT_SIZE)

  /* ======================================================= */
  /* Cell pool                                               */
  /* ======================================================= */

  const cellPoolRef = useRef<CellPool<InternalRecyclerCell>>(
    new CellPool<InternalRecyclerCell>()
  )

  const activeCellsRef = useRef<InternalRecyclerCell[]>([])
  const nextKeyRef = useRef<number>(0)

  const createCell = (type: CellType): InternalRecyclerCell => ({
    key: nextKeyRef.current++,
    type,
    index: -1,
    active: false,
  })

  /* ======================================================= */
  /* Visible window coordination                             */
  /* ======================================================= */

  const updateVisibleCells = (): void => {
    const range: VisibleRange | null =
      computeVisibleItemRange({
        layouts,
        offset: scrollOffsetRef.current,
        viewportSize: viewportSizeRef.current,
        buffer: viewportSizeRef.current * bufferRatio,
        isVertical,
      })

    

    if (range === null) return

    if (DEBUG) {
  console.log(
    '[RecyclerList] range:',
    range.startIndex,
    range.endIndex
  )
}


    const active = activeCellsRef.current

    // 1. Mark all inactive
    for (const cell of active) {
      cell.active = false
    }

    let writeIndex = 0

    // 2. Activate visible range
    for (
      let index = range.startIndex;
      index <= range.endIndex;
      index++
    ) {
      const item = data[index]
      if (item === undefined) continue

      const type = getCellType(item, index)

      // Seed pool once per type
      if (!cellPoolRef.current.hasType(type)) {
        const maxCells =
          Math.ceil(
            (viewportSizeRef.current / DEFAULT_ITEM_SIZE) *
              bufferRatio
          ) + 2

        cellPoolRef.current.registerType(type, maxCells)
        for (let i = 0; i < maxCells; i++) {
          cellPoolRef.current.release(createCell(type))
        }
      }

      let cell: InternalRecyclerCell | null =
        cellPoolRef.current.acquire(type)

if (cell === null) {
  const reusable = active.find(
    c => !c.active && c.type === type
  )

  cell = reusable ?? createCell(type)
}


      cell.index = index
      cell.active = true
      active[writeIndex++] = cell
    }

    // 3. Recycle unused cells
    for (let i = writeIndex; i < active.length; i++) {
      const cell = active[i]
      if (cell === undefined) continue

      cell.index = -1
      cell.active = false
      cellPoolRef.current.release(cell)
    }

    // 4. Compact once
    if (active.length !== writeIndex) {
      active.length = writeIndex
      forceRender(v => v + 1)
    }
  }

  /* ======================================================= */
  /* Handlers                                                */
  /* ======================================================= */

  const onScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ): void => {
    scrollOffsetRef.current = isVertical
      ? e.nativeEvent.contentOffset.y
      : e.nativeEvent.contentOffset.x

    updateVisibleCells()
  }

  const onLayout = (e: LayoutChangeEvent): void => {
    viewportSizeRef.current = isVertical
      ? e.nativeEvent.layout.height
      : e.nativeEvent.layout.width

    updateVisibleCells()
  }

  useEffect(() => {
    updateVisibleCells()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


if (DEBUG) {
  console.log('[RecyclerList] layouts:', layouts.length)
  console.log('[RecyclerList] contentSize:', contentSize)
  console.log('[RecyclerList] data.length:', data.length)
}

  /* ======================================================= */
  /* Render                                                  */
  /* ======================================================= */

  return (
    <ScrollView
      onScroll={onScroll}
      onLayout={onLayout}
      horizontal={!isVertical}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      removeClippedSubviews
    >
      {/* REQUIRED positioning container */}
      <View
        style={
          isVertical
            ? { height: contentSize }
            : { width: contentSize }
        }
      >
        {activeCellsRef.current.map(cell => {
          const layout = layouts[cell.index]
          const item = data[cell.index]

          if (layout === undefined || item === undefined) {
            return null
          }

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
              {renderItem({
                item,
                index: cell.index,
                cell,
              })}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

/* ========================================================= */

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
  },
})
