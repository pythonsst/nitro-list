import type { LayoutProvider } from './LayoutProvider'
import type { LayoutRectangle } from './LayoutRectangle'

/**
 * Layout provider using estimated item heights.
 * Used before real measurements are available.
 */
export class EstimatedLayoutProvider implements LayoutProvider {
  private readonly itemCount: number
  private readonly itemHeight: number
  private readonly width: number

  constructor(
    itemCount: number,
    itemHeight: number,
    width: number
  ) {
    this.itemCount = itemCount
    this.itemHeight = itemHeight
    this.width = width
  }

  getItemCount(): number {
    return this.itemCount
  }

  getLayout(index: number): LayoutRectangle {
    return {
      x: 0,
      y: index * this.itemHeight,
      width: this.width,
      height: this.itemHeight,
    }
  }
}
