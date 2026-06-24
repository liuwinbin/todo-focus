// ============================================================
// ActivityCategorySelector — 活动分类选择器
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TIME_LOG_CATEGORIES } from '../../types';
import type { TimeLogCategory } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface ActivityCategorySelectorProps {
  selected: TimeLogCategory;
  onSelect: (category: TimeLogCategory) => void;
}

export function ActivityCategorySelector({ selected, onSelect }: ActivityCategorySelectorProps) {
  return (
    <View style={styles.container}>
      {(Object.entries(TIME_LOG_CATEGORIES) as [TimeLogCategory, typeof TIME_LOG_CATEGORIES[TimeLogCategory]][]).map(
        ([key, config]) => {
          const isActive = selected === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onSelect(key)}
              style={[styles.item, isActive && { borderColor: config.color, backgroundColor: config.color + '20' }]}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{config.emoji}</Text>
              <Text style={[styles.label, isActive && { color: config.color, fontWeight: '600' }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.tabBarBorder,
    backgroundColor: colors.surface,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
