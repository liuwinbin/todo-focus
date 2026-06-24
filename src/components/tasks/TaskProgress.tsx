// ============================================================
// TaskProgress — 子任务完成进度条
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface TaskProgressProps {
  completed: number;
  total: number;
}

export function TaskProgress({ completed, total }: TaskProgressProps) {
  if (total === 0) return null;

  const fraction = completed / total;
  const percent = Math.round(fraction * 100);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` as any }]} />
      </View>
      <Text style={styles.text}>
        {completed}/{total} ({percent}%)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  text: {
    ...typography.caption,
    color: colors.textTertiary,
    minWidth: 50,
    textAlign: 'right',
  },
});
