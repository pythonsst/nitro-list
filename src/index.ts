// import { NitroModules } from 'react-native-nitro-modules'
// import type { NitroList } from './specs/nitro-list.nitro'

// /**
//  * High-performance HybridObject initialization.
//  * 'NitroList' must match the registration name in your nitro.json.
//  */
// export const NitroListModule = NitroModules.createHybridObject<NitroList>('NitroList')

// /**
//  * Robust Type Exports for Consumers.
//  * Explicit re-export prevents "Export not defined" errors during build.
//  */
// export type { NitroList, LayoutRectangle } from './specs/nitro-list.nitro'

// src/index.ts

export { RecyclerList } from './RecyclerList';
export type { RecyclerListProps } from './RecyclerList';

export { NitroListModule } from './NitroListModule';
export type { NitroList, LayoutRectangle } from './specs/nitro-list.nitro';

// UI (optional helpers)
export { ListItem } from './ListItem'
export type { RecyclerListTheme } from './theme'
export { defaultRecyclerListTheme } from './defaultTheme'
