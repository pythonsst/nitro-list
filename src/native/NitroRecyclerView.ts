import { requireNativeComponent } from 'react-native'

export type NitroRecyclerViewProps = {
  itemCount: number
}

export const NitroRecyclerView =
  requireNativeComponent<NitroRecyclerViewProps>('NitroRecyclerView')
