import { NitroModules } from 'react-native-nitro-modules';
import type { NitroList } from './specs/nitro-list.nitro';

/**
 * Runtime JS object backed by native NitroList implementation.
 */
export const NitroListModule =
  NitroModules.createHybridObject<NitroList>('NitroList');
