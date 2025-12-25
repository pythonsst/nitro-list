import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecyclerList } from 'react-native-nitro-list';

function App(): React.JSX.Element {
  const { width: containerWidth } = useWindowDimensions();
  const itemCount = 10_000;

  const itemHeights = useMemo<readonly number[]>(
    () => Array.from({ length: itemCount }, () => 80),
    [itemCount]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RecyclerList</Text>
        <Text style={styles.headerSubtitle}>
          Nitro-powered • 10,000 items • 60 FPS
        </Text>
      </View>

      {/* LIST */}
      <RecyclerList
        containerWidth={containerWidth}
        itemHeights={itemHeights}
        renderBufferRatio={1.3}
        renderItem={(index: number) => (
          <View style={styles.card}>
            <View style={styles.cardIndex}>
              <Text style={styles.cardIndexText}>
                {index + 1}
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                List Item #{index}
              </Text>
              <Text style={styles.cardSubtitle}>
                Recycled native view • Nitro layout
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


export default App;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  /* HEADER */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },

  /* CARD ROW */
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 2,
  },

  cardIndex: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  cardIndexText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
});
