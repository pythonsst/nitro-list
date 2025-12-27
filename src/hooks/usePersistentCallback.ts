import { useRef, useCallback } from 'react'

/**
 * Returns a function whose identity is stable across renders,
 * but always invokes the latest provided implementation.
 *
 * Invariants:
 * - Function reference NEVER changes
 * - Logic is ALWAYS up to date
 *
 * This is critical for long-lived systems such as:
 * - Recyclers
 * - Effects
 * - Native bridges
 * - Event pipelines
 */
export function usePersistentCallback<
  T extends (...args: never[]) => unknown
>(fn: T): T {

  /**
   * Holds the latest implementation.
   * Updating this does NOT trigger re-renders.
   */
  const fnRef = useRef(fn)
  fnRef.current = fn

  /**
   * Stable wrapper that forwards calls
   * to the latest implementation.
   */
  return useCallback(
    ((...args: never[]) =>
      fnRef.current(...args)) as T,
    []
  )
}
