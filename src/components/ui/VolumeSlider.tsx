// ============================================================
// VolumeSlider — 简易自定义音量滑块（不依赖第三方包）
// ============================================================
import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';

interface VolumeSliderProps {
  value: number;       // 0-1
  onValueChange: (value: number) => void;
  width?: number;
  height?: number;
}

export function VolumeSlider({ value, onValueChange, width = 200, height = 6 }: VolumeSliderProps) {
  const trackRef = useRef<View>(null);
  const trackLayoutRef = useRef({ x: 0, y: 0, w: width, h: height });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { x, y, width: w, height: h } = e.nativeEvent.layout;
    trackLayoutRef.current = { x, y, w, h };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateFromTouch(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateFromTouch(evt.nativeEvent.pageX);
      },
    }),
  ).current;

  const updateFromTouch = (pageX: number) => {
    const { x, w } = trackLayoutRef.current;
    const ratio = Math.max(0, Math.min(1, (pageX - x) / w));
    onValueChange(ratio);
  };

  const thumbWidth = 20;

  return (
    <View
      ref={trackRef}
      onLayout={onLayout}
      style={[styles.track, { width, height: thumbWidth }]}
      {...panResponder.panHandlers}
    >
      {/* 轨道 */}
      <View style={[styles.trackBg, { height }]} />
      {/* 填充 */}
      <View
        style={[
          styles.trackFill,
          { height, width: `${value * 100}%` as unknown as number },
        ]}
      />
      {/* 滑块 */}
      <View
        style={[
          styles.thumb,
          { left: `${value * 100}%` as unknown as number, marginLeft: -thumbWidth / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    position: 'relative',
  },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.tabBarBorder,
    borderRadius: 3,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    top: 0,
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
