import { requireNativeComponent, type ViewProps, } from 'react-native'

export interface RecyclerViewProps extends ViewProps {
  itemCount: number
}

/**
 * The high-performance native scrolling container.
 */
export const RecyclerView =
  requireNativeComponent<RecyclerViewProps>('RecyclerView')