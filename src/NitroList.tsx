import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { RecyclerListViewNative } from './native/RecyclerListViewNative'

export function NitroList<T>({
  data,
  itemHeight,
  renderItem,
  containerCrossAxisSize,
  viewportHeight,
}: {
  data: readonly T[]
  itemHeight: number
  renderItem: (info: { item: T; index: number }) => React.ReactElement
  containerCrossAxisSize: number
  viewportHeight: number
}) {
  // 🔑 Native-driven scroll offset (will be updated from native later)
  const [scrollOffset] = useState(0)

  const contentSize = data.length * itemHeight

  const start = Math.max(
    0,
    Math.floor(scrollOffset / itemHeight) - 5
  )

  const end = Math.min(
    data.length,
    Math.ceil((scrollOffset + viewportHeight) / itemHeight) + 5
  )

  const children = useMemo(() => {
    const out: React.ReactElement[] = []

    for (let i = start; i < end; i++) {
      out.push(
        <View
          key={i}
          style={{
            position: 'absolute',
            top: i * itemHeight,
            height: itemHeight,
            left: 0,
            right: 0,
          }}
        >
          {renderItem({ item: data[i], index: i })}
        </View>
      )
    }

    return out
  }, [start, end, data, itemHeight, renderItem])

  console.log('[NitroList JS]', {
    containerCrossAxisSize,
    viewportHeight,
    contentSize,
    scrollOffset,
    start,
    end,
  })

  return (
    <RecyclerListViewNative
      containerCrossAxisSize={containerCrossAxisSize}
      containerMainAxisSize={viewportHeight}
      contentSize={contentSize}
    >
      {children}
    </RecyclerListViewNative>
  )
}
