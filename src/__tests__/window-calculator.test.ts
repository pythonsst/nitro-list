import { calculateWindow } from '../windowing/WindowCalculator'

test('calculateWindow returns visible indices', () => {
  const layouts = [
    { x: 0, y: 0, width: 100, height: 50 },
    { x: 0, y: 50, width: 100, height: 50 },
    { x: 0, y: 100, width: 100, height: 50 },
  ]

  const result = calculateWindow(
    layouts,
    { offsetY: 60, height: 40 },
    0
  )

  expect(result.indices).toEqual([1])
})
