// Immutable view (safe for props / calculations)
export interface Viewport {
  readonly offsetY: number
  readonly height: number
}

// Mutable view (ONLY for refs)
export interface MutableViewport {
  offsetY: number
  height: number
}
