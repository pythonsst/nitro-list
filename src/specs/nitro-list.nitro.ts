import type {
  HybridView,
  HybridViewProps,
  HybridViewMethods,
} from 'react-native-nitro-modules'

export interface NitroListProps extends HybridViewProps {
   isRed: boolean
}

export interface NitroListMethods extends HybridViewMethods {}

export type NitroList = HybridView<NitroListProps, NitroListMethods, { ios: 'swift', android: 'kotlin' }>