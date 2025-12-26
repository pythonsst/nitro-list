import type { LayoutChangeEvent } from 'react-native'

export interface MeasuredLayout {
  readonly width: number
  readonly height: number
}

/**
 * Extracts stable layout measurements from RN onLayout event.
 */
export function measureLayout(
  event: LayoutChangeEvent
): MeasuredLayout {
  const { width, height } = event.nativeEvent.layout

  return {
    width,
    height,
  }
}
