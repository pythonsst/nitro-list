// src/getVisibleIndices.ts

import type { LayoutRectangle } from './specs/nitro-list.nitro';

/**
 * Computes indices whose layouts intersect the visible
 * viewport plus an overscan buffer.
 *
 * Pure function. No side effects.
 */
export function getVisibleIndices(
  layouts: readonly LayoutRectangle[],
  contentOffsetY: number,
  viewportHeight: number,
  renderBufferPx: number
): number[] {
  if (layouts.length === 0) {
    return [];
  }

  const windowTop = contentOffsetY - renderBufferPx;
  const windowBottom = contentOffsetY + viewportHeight + renderBufferPx;

  const result: number[] = [];

  for (let i = 0; i < layouts.length; i++) {
    const rect = layouts[i];
    if (!rect) {
      // Required for `noUncheckedIndexedAccess`
      continue;
    }

    const rectTop = rect.y;
    const rectBottom = rect.y + rect.height;

    if (rectBottom > windowTop && rectTop < windowBottom) {
      result.push(i);
    } else if (rectTop > windowBottom) {
      // Layouts are ordered by y; safe early exit
      break;
    }
  }

  return result;
}
