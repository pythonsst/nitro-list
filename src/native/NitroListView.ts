import { requireNativeComponent, type ViewProps } from 'react-native'

/**
 * Props for the NitroListView.
 * * We extend ViewProps so that developers can use standard styles 
 * like 'flex: 1' or 'backgroundColor' on the list.
 */
export type NitroListViewProps = ViewProps & {
  /**
   * The total number of items to be displayed in the list.
   * This is passed to the native side (Swift/Kotlin) for layout math.
   */
  itemCount: number
}

/**
 * The Native Component that maps to the physical view in Swift/Kotlin.
 * * 'NitroListView' is the "Secret Handshake" name. It must match 
 * the name exported by your Native ViewManagers.
 */
export const NitroListView =
  requireNativeComponent<NitroListViewProps>('NitroListView')