/**
 * Callback invoked when new items should be prefetched.
 */
export type PrefetchCallback = (indices: number[]) => void

/**
 * PrefetchHelper
 *
 * Stateless with respect to layout.
 * Only tracks what has already been prefetched to avoid duplication.
 *
 * Designed to be driven by *visible window*, not scroll events.
 */
export class PrefetchHelper {
  private lastPrefetched = new Set<number>()

  runPrefetch(
    visibleIndices: readonly number[],
    itemCount: number,
    aheadCount: number,
    onPrefetch: PrefetchCallback
  ) {
    if (visibleIndices.length === 0) return

    const lastVisible =
      visibleIndices[visibleIndices.length - 1]!

    const start = lastVisible + 1
    const end = Math.min(
      itemCount - 1,
      start + aheadCount
    )

    const toPrefetch: number[] = []

    for (let i = start; i <= end; i++) {
      if (!this.lastPrefetched.has(i)) {
        this.lastPrefetched.add(i)
        toPrefetch.push(i)
      }
    }

    if (toPrefetch.length > 0) {
      onPrefetch(toPrefetch)
    }
  }
}
