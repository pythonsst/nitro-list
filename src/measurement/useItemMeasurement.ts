import { useCallback, useRef } from 'react'
import type { LayoutChangeEvent } from 'react-native'

/**
 * Hook to measure a rendered item safely.
 *
 * Guarantees:
 * - No duplicate height reports
 * - No render loops
 * - Stable callback identity
 */
export function useItemMeasurement(
  index: number,
  onMeasured: (index: number, height: number) => void
) {
  const lastHeightRef = useRef<number | null>(null)

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height

      // Ignore identical measurements
      if (lastHeightRef.current === height) return

      lastHeightRef.current = height
      onMeasured(index, height)
    },
    [index, onMeasured]
  )

  return onLayout
}
