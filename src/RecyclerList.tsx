// src/RecyclerList.tsx

import React, { useEffect, useMemo, useCallback } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { NitroListModule } from './NitroListModule';
import { useRecyclerList } from './useRecyclerList';
import { getVisibleIndices } from './getVisibleIndices';
import type { LayoutRectangle } from './specs/nitro-list.nitro';

export type RecyclerListProps = {
  containerWidth: number;
  itemHeights: readonly number[];
  renderBufferRatio?: number;
  renderItem: (index: number) => React.ReactElement;
};

export function RecyclerList({
  containerWidth,
  itemHeights,
  renderBufferRatio = 1,
  renderItem,
}: RecyclerListProps) {
  const { views, reconcile } = useRecyclerList();

  const viewportHeight = Dimensions.get('window').height;

  /**
   * Native layout computation (runs once per data change).
   */
  const layouts = useMemo<readonly LayoutRectangle[]>(() => {
    if (itemHeights.length === 0) {
      return [];
    }

    return NitroListModule.computeLayout(containerWidth, itemHeights);
  }, [containerWidth, itemHeights]);

  /**
   * Total scrollable height.
   */
  const totalHeight = useMemo(() => {
    if (layouts.length === 0) {
      return 0;
    }

    const last = layouts[layouts.length - 1];
    if (!last) {
      return 0;
    }

    return last.y + last.height;
  }, [layouts]);

  /**
   * Initial windowing to avoid blank screen.
   */
  useEffect(() => {
    if (layouts.length === 0) {
      return;
    }

    const bufferPx = viewportHeight * renderBufferRatio;
    const initialIndices = getVisibleIndices(
      layouts,
      0,
      viewportHeight,
      bufferPx
    );

    reconcile(initialIndices);
  }, [layouts, viewportHeight, renderBufferRatio, reconcile]);

  /**
   * Scroll handler → windowing → reconciliation.
   */
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const bufferPx = viewportHeight * renderBufferRatio;

      const indices = getVisibleIndices(
        layouts,
        offsetY,
        viewportHeight,
        bufferPx
      );

      reconcile(indices);
    },
    [layouts, viewportHeight, renderBufferRatio, reconcile]
  );

  return (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={handleScroll}
      removeClippedSubviews
    >
      <View style={{ height: totalHeight }}>
        {views.map((slot) => {
          const layout = layouts[slot.index];
          if (!layout) {
            return null;
          }

          return (
            <View
              key={slot.key}
              style={{
                position: 'absolute',
                top: layout.y,
                left: layout.x,
                width: layout.width,
                height: layout.height,
              }}
            >
              {renderItem(slot.index)}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
