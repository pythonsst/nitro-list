import React, { useMemo } from 'react'
import { View } from 'react-native'
import { RecyclerListViewNative } from './native/RecyclerListViewNative'

export function NitroList<T>({
  data,
  itemHeight,
  renderItem,
  containerCrossAxisSize,
  viewportHeight,
  scrollOffset,
}: {
  data: readonly T[]
  itemHeight: number
  renderItem: (info: { item: T; index: number }) => React.ReactElement
  containerCrossAxisSize: number
  viewportHeight: number
  scrollOffset: number
}) {
  const contentSize = data.length * itemHeight

  const start = Math.max(0, Math.floor(scrollOffset / itemHeight) - 5)
  const end = Math.min(
    data.length,
    Math.ceil((scrollOffset + viewportHeight) / itemHeight) + 5
  )

  const children = useMemo(() => {
    const out = []
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
  }, [start, end, data])

  return (
    <RecyclerListViewNative
      containerCrossAxisSize={containerCrossAxisSize}
      contentSize={contentSize}
      scrollOffset={scrollOffset}
    >
      {children}
    </RecyclerListViewNative>
  )
}
