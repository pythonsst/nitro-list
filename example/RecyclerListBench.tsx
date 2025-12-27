// FlashListBench.tsx
import React, { useCallback, useMemo } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'

import { ListCard } from './ListCard'

export function FlashListBench() {
  const { width } = useWindowDimensions()
  const itemCount = 10_000

  const data = useMemo(
    () => Array.from({ length: itemCount }, (_, i) => i),
    [itemCount]
  )

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <ListCard
        index={item}
        title={`List Item #${item}`}
        subtitle="Recycled native view • Nitro layout"
        description={
          item % 3 === 0
            ? 'This item has a longer description which increases height dynamically.'
            : undefined
        }
        imageUrl={
          item % 5 === 0
            ? 'https://picsum.photos/600/400'
            : undefined
        }
      />
    ),
    []
  )

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => String(item)}
        estimatedItemSize={140} // 🔑 VERY IMPORTANT
      />
    </View>
  )
}
