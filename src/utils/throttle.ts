export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  ms: number
): T {
  let last = 0
  return ((...args: never[]) => {
    const now = Date.now()
    if (now - last > ms) {
      last = now
      fn(...args)
    }
  }) as T
}
