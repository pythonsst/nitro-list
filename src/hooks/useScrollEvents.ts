import { useCallback, useState } from 'react'
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from 'react-native'
import type { Viewport } from '../windowing/Viewport'

export function useScrollEvents(): {
  readonly viewport: Viewport
  readonly onScroll: (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => void
  readonly onLayout: (e: LayoutChangeEvent) => void
} {
  const [viewport, setViewport] = useState<Viewport>({
    offsetY: 0,
    height: 0,
  })

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height

    setViewport((prev) => ({
      offsetY: prev.offsetY,
      height,
    }))
  }, [])

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = e.nativeEvent

      setViewport((prev) => ({
        offsetY: contentOffset.y,
        height: prev.height,
      }))
    },
    []
  )

  return { viewport, onScroll, onLayout }
}
