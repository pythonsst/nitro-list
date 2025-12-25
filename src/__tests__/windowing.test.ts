import { getVisibleRange } from '../windowing/BinarySearchWindow'

test('returns visible indices within viewport', () => {
  const layouts = [
    { x: 0, y: 0, width: 100, height: 50 },
    { x: 0, y: 50, width: 100, height: 50 },
    { x: 0, y: 100, width: 100, height: 50 },
  ]

  const visible = getVisibleRange(
    layouts,
    { offsetY: 25, height: 50 },
    0
  )

  expect(visible).toEqual([0, 1])
})
