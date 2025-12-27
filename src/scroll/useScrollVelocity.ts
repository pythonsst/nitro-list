export function createScrollVelocityTracker() {
  let lastOffset = 0
  let lastTime = Date.now()

  return function getVelocity(offset: number): number {
    const now = Date.now()
    const dt = now - lastTime
    const dy = Math.abs(offset - lastOffset)

    lastOffset = offset
    lastTime = now

    if (dt === 0) return 0
    return dy / dt // px per ms
  }
}
