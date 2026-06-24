// ============================================================
// CategoryBadge — 任务分类标签（工作/学习/生活）
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { TASK_CATEGORIES, type TaskCategory } from '../../types';

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = TASK_CATEGORIES[category];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: config.color + '20' },
      ]}
    >
      <Text style={[styles.emoji, isSmall && styles.emojiSm]}>{config.emoji}</Text>
      {!isSmall && <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  badgeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    gap: 2,
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 14,
  },
  emojiSm: {
    fontSize: 11,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
