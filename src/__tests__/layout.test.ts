import { computeLinearLayout } from '../layout/LayoutEngine'

test('linear layout accumulates y offsets', () => {
  const layouts = computeLinearLayout(100, [10, 20, 30])

  expect(layouts).toHaveLength(3)

  const first = layouts[0]!
  const second = layouts[1]!
  const third = layouts[2]!

  expect(first.y).toBe(0)
  expect(second.y).toBe(10)
  expect(third.y).toBe(30)
})
