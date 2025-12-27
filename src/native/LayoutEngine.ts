import { NitroModules } from 'react-native-nitro-modules'
// We rename the import to 'LayoutEngineSpec' locally to avoid the name clash
import type { LayoutEngine as LayoutEngineSpec } from '../specs/layout-engine.nitro'

/**
 * The JS-side instance of our Native Layout Engine.
 * This is the primary entry point for the layout logic.
 */
export const LayoutEngine = 
  NitroModules.createHybridObject<LayoutEngineSpec>('LayoutEngine')