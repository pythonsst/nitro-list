import { NitroModules } from 'react-native-nitro-modules'
import type { NitroLayoutEngine as NitroLayoutEngineSpec } from '../specs/nitro-layout-engine.nitro'

export const NitroLayoutEngine =
  NitroModules.createHybridObject<NitroLayoutEngineSpec>(
    'NitroLayoutEngine'
  )
