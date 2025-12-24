import { NitroModules } from 'react-native-nitro-modules'
import type { NitroList } from './specs/nitro-list.nitro'

/**
 * High-performance HybridObject initialization.
 * 'NitroList' must match the registration name in your nitro.json.
 */
export const NitroListModule = NitroModules.createHybridObject<NitroList>('NitroList')

/**
 * Robust Type Exports for Consumers.
 * Explicit re-export prevents "Export not defined" errors during build.
 */
export type { NitroList, LayoutRectangle } from './specs/nitro-list.nitro'