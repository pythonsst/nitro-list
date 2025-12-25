import { useCallback } from 'react'
import type { LayoutChangeEvent } from 'react-native'

export function useItemMeasurement(
  index: number,
  onMeasure: (index: number, height: number) => void
) {
  return useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height
      onMeasure(index, height)
    },
    [index, onMeasure]
  )
}
