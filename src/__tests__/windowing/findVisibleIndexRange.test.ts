import { findVisibleIndexRange } from '../../windowing/findVisibleIndexRange'

describe('findVisibleIndexRange', () => {
  /**
   * Layouts:
   * index 0 → y: 0–50
   * index 1 → y: 50–100
   * index 2 → y: 100–150
   * ...
   */
  const layouts = Array.from({ length: 10 }, (_, i) => ({
    x: 0,
    y: i * 50,
    width: 100,
    height: 50,
  }))

  it('returns empty array when layouts are empty', () => {
    const result = findVisibleIndexRange([], { offsetY: 0, height: 300 }, 100)

    expect(result).toEqual([])
  })
  it('returns correct visible indices without buffer', () => {
    const result = findVisibleIndexRange(
      layouts,
      { offsetY: 100, height: 150 },
      0
    )

    /**
     * Viewport: 100–250 (inclusive)
     * Items that intersect this window:
     * indices 1–5
     */
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('extends window using bufferPx (inclusive boundaries)', () => {
    const result = findVisibleIndexRange(
      layouts,
      { offsetY: 100, height: 100 },
      100
    )

    /**
     * Viewport:      100–200
     * Buffer:        ±100
     * Effective win: 0–300 (inclusive)
     *
     * index 6 starts at y = 300 → included by design
     * This matches FlashList / RecyclerView behavior
     */
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})
