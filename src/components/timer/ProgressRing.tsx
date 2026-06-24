// ============================================================
// ProgressRing — SVG 圆形进度环（Reanimated 动画）
// ============================================================
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import { colors } from '../../constants/theme';
import type { SessionType } from '../../types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;         // 0-1
  size: number;
  strokeWidth: number;
  sessionType: SessionType;
  children: React.ReactNode;
}

const CIRCUMFERENCE_300 = 2 * Math.PI * 135; // r=135, 300-size ring

export function ProgressRing({
  progress,
  size = 260,
  strokeWidth = 6,
  sessionType,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 300 });
  }, [progress, progressAnim]);

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference * (1 - progressAnim.value);
    return {
      strokeDashoffset: offset,
    };
  });

  const trackColor = sessionType === 'focus' ? colors.timerFocusTrack : colors.timerBreakTrack;
  const progressColor = sessionType === 'focus' ? colors.timerFocus : colors.timerBreak;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* 背景轨道 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 进度弧 */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {/* 内容插槽 */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
