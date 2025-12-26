import { useCallback, useState } from 'react'
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import type { ScrollMetrics } from './ScrollMetrics'

/**
 * Scroll metrics hook.
 * Provides stable scroll snapshot + handlers.
 *
 * FlashList equivalent: useScrollMetrics
 */
export function useScrollMetrics(): {
  metrics: ScrollMetrics
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  onLayout: (e: LayoutChangeEvent) => void
} {
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    offsetY: 0,
    height: 0,
  })

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y

      setMetrics(prev =>
        prev.offsetY === offsetY
          ? prev
          : { ...prev, offsetY }
      )
    },
    []
  )

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height

      setMetrics(prev =>
        prev.height === height
          ? prev
          : { ...prev, height }
      )
    },
    []
  )

  return {
    metrics,
    onScroll,
    onLayout,
  }
}
