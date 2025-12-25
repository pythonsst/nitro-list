export function shallowEqual(
  a: unknown,
  b: unknown
): boolean {
  if (Object.is(a, b)) return true

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false
  }

  const aKeys = Object.keys(a as object)
  const bKeys = Object.keys(b as object)

  if (aKeys.length !== bKeys.length) return false

  for (const key of aKeys) {
    if (
      !(key in (b as object)) ||
      !Object.is(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    ) {
      return false
    }
  }

  return true
}
