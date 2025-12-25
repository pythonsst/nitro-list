import type { LayoutProvider } from '../layout/LayoutProvider'

export function applyMeasurement(
  provider: LayoutProvider,
  index: number,
  height: number
): void {
  provider.updateLayout(index, height)
}
