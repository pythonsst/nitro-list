import type { LayoutProvider } from './LayoutProvider'
import type { LayoutRectangle } from './LayoutRectangle'

/**
 * Resolves layouts eagerly into a contiguous array.
 * Pure, deterministic, and reusable.
 *
 * FlashList equivalent: internal layout resolver.
 */
export function computeLayouts(
  provider: LayoutProvider
): readonly LayoutRectangle[] {
  const count = provider.getItemCount()
  const layouts: LayoutRectangle[] = new Array(count)

  for (let i = 0; i < count; i++) {
    layouts[i] = provider.getLayout(i)
  }

  return layouts
}
