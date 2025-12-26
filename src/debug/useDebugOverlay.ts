import { useEffect } from 'react'

export function useDebugOverlay(
  enabled: boolean,
  visibleCount: number
): void {
  useEffect(() => {
    if (__DEV__ && enabled) {
      console.log(
        `[RecyclerList] visible items: ${visibleCount}`
      )
    }
  }, [enabled, visibleCount])
}
