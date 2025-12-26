/**
 * Jest setup for react-native-nitro-list
 *
 * IMPORTANT:
 * - This is a library, not an app
 * - Do NOT mock app-level deps (gesture-handler, reanimated)
 * - Keep setup minimal and stable
 */

// Silence Fabric availability warnings (RN New Architecture safe)
jest.mock(
  'react-native/Libraries/ReactNative/FabricUIManager',
  () => ({
    isAvailable: () => false,
  })
)
