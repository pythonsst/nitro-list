// FlashListBench.tsx
import React, { useCallback } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { ListCard } from 'ListCard'

export function FlashListBench() {
  const { width } = useWindowDimensions()
  const itemCount = 10_000

  const data = Array.from({ length: itemCount }, (_, i) => i)

  const renderItem = useCallback(
    ({ item }: { item: number }) => <ListCard index={item} />,
    []
  )

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item)}
      />
    </View>
  )
}
