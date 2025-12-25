import { useRef, useCallback } from 'react'

export function useStableCallback<T extends (...args: never[]) => unknown>(
  fn: T
): T {
  const ref = useRef(fn)
  ref.current = fn

  return useCallback(
    ((...args: never[]) => ref.current(...args)) as T,
    []
  )
}
