import { NitroModules } from 'react-native-nitro-modules'
import type { NitroList } from '../specs/nitro-list.nitro'

export const NitroListModule =
  NitroModules.createHybridObject<NitroList>('NitroList')
