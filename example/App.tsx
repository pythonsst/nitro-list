import React, { useMemo, useCallback, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native'
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { RecyclerList } from 'react-native-nitro-list'

/* ---------------- CONFIG ---------------- */

const ITEM_COUNT = 10_000
const ROW_HEIGHT = 76

/* ---------------- ROW ---------------- */

const Row = React.memo(({ index }: { index: number }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardIndex}>
        <Text style={styles.cardIndexText}>{index + 1}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>List Item #{index + 1}</Text>
        <Text style={styles.cardSubtitle}>
          Recycled native view • Nitro layout
        </Text>
      </View>
    </View>
  )
})

/* ---------------- APP ---------------- */

export default function App(): React.JSX.Element {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const [mode, setMode] =
    useState<'nitro' | 'flash'>('nitro')

  /* Data is the source of truth */
  const data = useMemo(
    () => Array.from({ length: ITEM_COUNT }, (_, i) => i),
    []
  )

  /* Main-axis sizes (required for deterministic layout) */
  const itemMainAxisSizes = useMemo(
    () => Array.from({ length: ITEM_COUNT }, () => ROW_HEIGHT),
    []
  )

  /* Nitro renderer (NEW API) */
  const renderNitroItem = useCallback(
    ({
      item,
      index,
    }: {
      item: number
      index: number
    }) => <Row index={index} />,
    []
  )

  /* FlashList renderer */
  const renderFlashItem = useCallback(
    ({ item }: { item: number }) => <Row index={item} />,
    []
  )

  const toggle = () =>
    setMode(m => (m === 'nitro' ? 'flash' : 'nitro'))

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>
          {mode === 'nitro'
            ? 'RecyclerList (Nitro)'
            : 'FlashList'}
        </Text>

        <Pressable style={styles.switch} onPress={toggle}>
          <Text style={styles.switchText}>Switch</Text>
        </Pressable>
      </View>

      {/* LIST */}
      <View style={styles.listContainer}>
        {mode === 'nitro' ? (
          <RecyclerList
            data={data}
            // itemSpacing={32}
            scrollDirection="vertical"
            containerCrossAxisSize={width}
            itemMainAxisSizes={itemMainAxisSizes}
            bufferRatio={1.3}
            getCellType={() => 'row'}
            renderItem={renderNitroItem}
          />
        ) : (
          <FlashList
            data={data}
            renderItem={renderFlashItem}
            // estimatedItemSize={ROW_HEIGHT}
            keyExtractor={item => String(item)}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  switch: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4F46E5',
    borderRadius: 6,
  },

  switchText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },

  listContainer: {
    flex: 1,
  },

  card: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  cardIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  cardIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },
})
