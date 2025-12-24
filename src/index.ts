import { getHostComponent, type HybridRef } from 'react-native-nitro-modules'
import NitroListConfig from '../nitrogen/generated/shared/json/NitroListConfig.json'
import type {
  NitroListProps,
  NitroListMethods,
} from './specs/nitro-list.nitro'


export const NitroList = getHostComponent<NitroListProps, NitroListMethods>(
  'NitroList',
  () => NitroListConfig
)

export type NitroListRef = HybridRef<NitroListProps, NitroListMethods>
