import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  Dimensions
} from 'react-native';
import { NitroListModule, type LayoutRectangle } from 'react-native-nitro-list';

/**
 * 1. Optimized List Item Component
 * We use React.memo to prevent re-renders when the list scrolls.
 */
const ListItem = React.memo(({ index, rect }: { index: number; rect: LayoutRectangle }) => {
  return (
    <View 
      style={[
        styles.item, 
        { 
          height: rect.height, 
          // GPU-accelerated positioning for 60fps
          transform: [{ translateY: rect.y }] 
        }
      ]}
    >
      <Text style={styles.itemText}>Item #{index}</Text>
      <Text style={styles.debugText}>Native Y: {rect.y.toFixed(0)}px</Text>
    </View>
  );
});

// Buffer to render items before they enter the screen to prevent "white flash"
const VIEWPORT_BUFFER = 600; 
const SCREEN_HEIGHT = Dimensions.get('window').height;

function App(): React.JSX.Element {
  const [layouts, setLayouts] = useState<LayoutRectangle[]>([]);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const [metrics, setMetrics] = useState({ total: 10000, rendered: 0 });

  // 2. Initialize the Native Engine
  useEffect(() => {
    const itemCount = 10000;
    // Generate heights once
    const itemHeights = Array.from({ length: itemCount }, () => Math.floor(Math.random() * 80) + 60);
    
    // Call the World-Class Swift Math Engine
    const result = NitroListModule.computeLayout(Dimensions.get('window').width, itemHeights);
    setLayouts(result);
    
    // Initial calculate for top of the list
    calculateVisible(0, result);
  }, []);

  /**
   * 3. Efficient Virtualization Logic
   * Only items within the (Screen + Buffer) window stay in the React tree.
   */
  const calculateVisible = useCallback((offsetY: number, currentLayouts: LayoutRectangle[]) => {
    if (currentLayouts.length === 0) return;

    const startBoundary = offsetY - VIEWPORT_BUFFER;
    const endBoundary = offsetY + SCREEN_HEIGHT + VIEWPORT_BUFFER;

    const visible = [];
    for (let i = 0; i < currentLayouts.length; i++) {
      const rect = currentLayouts[i];
      // Check if item is in the visible window
      if (rect.y + rect.height > startBoundary && rect.y < endBoundary) {
        visible.push(i);
      } else if (rect.y > endBoundary) {
        // Since list is sorted by Y, we can stop early for massive performance
        break; 
      }
    }

    setVisibleIndices(visible);
    setMetrics(prev => ({ ...prev, rendered: visible.length }));
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    calculateVisible(e.nativeEvent.contentOffset.y, layouts);
  };

  // Total height calculated from Swift blueprint
  const totalContentHeight = useMemo(() => {
    if (layouts.length === 0) return 0;
    const last = layouts[layouts.length - 1];
    return last.y + last.height;
  }, [layouts]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nitro-List Final</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>Total: {metrics.total}</Text></View>
          <View style={[styles.badge, styles.greenBadge]}>
            <Text style={styles.badgeText}>Active Views: {metrics.rendered}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Capture every frame for smoothness
        removeClippedSubviews={true}
      >
        <View style={{ height: totalContentHeight, width: '100%' }}>
          {visibleIndices.map((idx) => (
            <ListItem key={idx} index={idx} rect={layouts[idx]} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 12 },
  badgeRow: { flexDirection: 'row', gap: 10 },
  badge: { backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  greenBadge: { backgroundColor: '#1A3F23' },
  badgeText: { color: '#32D74B', fontSize: 12, fontWeight: 'bold', fontFamily: 'Menlo' },
  scrollView: { flex: 1 },
  item: { 
    position: 'absolute', // Absolute positioning is key for virtualization
    width: '100%', 
    backgroundColor: '#1c1c1e', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#333', 
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  itemText: { color: '#FFF', fontSize: 17, fontWeight: '500' },
  debugText: { color: '#666', fontSize: 11, marginTop: 4, fontFamily: 'Courier' }
});

export default App;