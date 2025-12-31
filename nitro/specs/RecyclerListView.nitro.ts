import type {
  HybridView,
  HybridViewProps,
  HybridViewMethods,
} from 'react-native-nitro-modules'

export interface RecyclerListViewProps extends HybridViewProps {
  containerCrossAxisSize: number      // width
  containerMainAxisSize: number       // height (viewport)
  contentSize: number                // total scroll height           // controlled offset (for now)
}

export interface RecyclerListViewMethods extends HybridViewMethods {}

export type RecyclerListView =
  HybridView<
    RecyclerListViewProps,
    RecyclerListViewMethods,
    { ios: 'swift'; android: 'kotlin' }
  >
