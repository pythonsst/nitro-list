import type { LayoutRectangle } from "./LayoutRectangle"

export interface LayoutProvider {
  getLayout(index: number): LayoutRectangle
  updateLayout(index: number, measuredHeight: number): void
  getContentHeight(): number
}
