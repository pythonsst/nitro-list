import { getHostComponent } from 'react-native-nitro-modules'
import type {
  RecyclerListViewProps,
  RecyclerListViewMethods,
} from '../../nitro/specs/RecyclerListView.nitro'

import RecyclerListViewConfig
  from '../../nitrogen/generated/shared/json/RecyclerListViewConfig.json'

export const RecyclerListViewNative =
  getHostComponent<
    RecyclerListViewProps,
    RecyclerListViewMethods
  >(
    'RecyclerListView',
    () => RecyclerListViewConfig
  )
