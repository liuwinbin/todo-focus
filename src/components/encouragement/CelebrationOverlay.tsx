// ============================================================
// CelebrationOverlay — 庆祝动画
// ============================================================
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatMinutes } from '../../utils/dates';

interface CelebrationOverlayProps {
  visible: boolean;
  focusMinutes: number;
  todayTotal: number;
  streak: number;
  onDismiss: () => void;
}

export function CelebrationOverlay({
  visible,
  focusMinutes,
  todayTotal,
  streak,
  onDismiss,
}: CelebrationOverlayProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 200 }),
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible, opacity, scale]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>太棒了！</Text>
        <Text style={styles.subtitle}>
          你专注了 {formatMinutes(focusMinutes)}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayTotal}</Text>
            <Text style={styles.statLabel}>今日完成</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.streakFlame }]}>
              {streak}
            </Text>
            <Text style={styles.statLabel}>连续天数</Text>
          </View>
        </View>

        <Button
          title="继续加油 💪"
          onPress={onDismiss}
          variant="primary"
          size="lg"
          style={styles.button}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 68, 88, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...typography.heading1,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.tabBarBorder,
  },
  button: {
    minWidth: 200,
    marginTop: spacing.md,
  },
});
