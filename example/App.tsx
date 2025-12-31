import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { NitroList } from 'react-native-nitro-list'

const DATA = Array.from({ length: 500 }, (_, i) => `Item ${i}`)
const HEADER_HEIGHT = 56

function AppContent() {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const viewportHeight =
    height - insets.top - insets.bottom - HEADER_HEIGHT

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NitroList running ✅</Text>
      </View>

      <NitroList
        data={DATA}
        itemHeight={60}
        containerCrossAxisSize={width}
        viewportHeight={viewportHeight}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 14,
  },
})
