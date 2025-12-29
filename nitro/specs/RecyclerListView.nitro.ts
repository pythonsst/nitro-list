import type {
  HybridView,
  HybridViewProps,
  HybridViewMethods,
} from 'react-native-nitro-modules'

export interface RecyclerListViewProps extends HybridViewProps {
  containerCrossAxisSize: number
  contentSize: number
  scrollOffset: number
}

export interface RecyclerListViewMethods extends HybridViewMethods {}

export type RecyclerListView =
  HybridView<
    RecyclerListViewProps,
    RecyclerListViewMethods,
    { ios: 'swift'; android: 'kotlin' }
  >
