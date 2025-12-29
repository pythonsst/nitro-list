import React, { useState } from 'react'
import {
  SafeAreaView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { NitroList } from 'react-native-nitro-list'

const DATA = Array.from({ length: 500 }, (_, i) => `Item ${i}`)

export default function App() {
  const { width, height } = useWindowDimensions()
  const [offset] = useState(0)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ padding: 16 }}>NitroList running ✅</Text>

      <NitroList
        data={DATA}
        itemHeight={60}
        containerCrossAxisSize={width}
        viewportHeight={height}
        scrollOffset={offset}
        renderItem={({ item }) => (
          <View
            style={{
              height: 60,
              justifyContent: 'center',
              paddingHorizontal: 16,
              borderBottomWidth: 1,
            }}
          >
            <Text>{item}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}
