export function getStableKey(
  slotKey: string,
  index: number
): string {
  return `${slotKey}:${index}`
}
