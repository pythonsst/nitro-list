import { useCallback, useRef } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { measureLayout } from './MeasureLayout'

export type ItemMeasurementCallback = (
  index: number,
  height: number
) => void

/**
 * Manages per-item layout measurement.
 * Safe to use on every cell.
 */
export function useItemMeasurement(
  index: number,
  onMeasured: ItemMeasurementCallback
) {
  const lastHeightRef = useRef<number | null>(null)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = measureLayout(event)

      // Deduplicate identical measurements
      if (lastHeightRef.current === height) {
        return
      }

      lastHeightRef.current = height
      onMeasured(index, height)
    },
    [index, onMeasured]
  )

  return onLayout
}
