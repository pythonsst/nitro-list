import { ViewRecycler } from '../recycler/ViewRecycler'

test('reuses slots of same type', () => {
  const recycler = new ViewRecycler()

  const a = recycler.acquire(0, 'row')
  recycler.releaseUnused([1])

  const b = recycler.acquire(1, 'row')

  expect(a.key).toBe(b.key)
})
