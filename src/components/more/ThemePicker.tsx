// ============================================================
// ThemePicker — 主题选择器
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { THEME_OPTIONS } from '../../types';
import type { ThemeId } from '../../types';

interface ThemePickerProps {
  selected: ThemeId;
  onSelect: (id: ThemeId) => void;
}

// 每个主题的预览色块
const THEME_PREVIEW_COLORS: Record<ThemeId, string[]> = {
  default: ['#C3B1E1', '#FFDAB9', '#F4A4A4', '#FFF8F0'],
  warm:    ['#FFB347', '#FF8C69', '#FFDAB9', '#FFF5EE'],
  cool:    ['#77DD77', '#A8E6CF', '#B2C9AB', '#F0F7F0'],
  dark:    ['#6C8EBF', '#A4C8E8', '#4A5568', '#2D3748'],
};

export function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  return (
    <View style={styles.grid}>
      {THEME_OPTIONS.map((theme) => {
        const isActive = selected === theme.id;
        const preview = THEME_PREVIEW_COLORS[theme.id];
        return (
          <TouchableOpacity
            key={theme.id}
            onPress={() => onSelect(theme.id)}
            style={[styles.card, isActive && styles.cardActive]}
            activeOpacity={0.7}
          >
            {/* 预览色块 */}
            <View style={styles.previewRow}>
              {preview.map((color, i) => (
                <View
                  key={i}
                  style={[styles.previewBlock, { backgroundColor: color }]}
                />
              ))}
            </View>
            <Text style={[styles.emoji]}>{theme.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {theme.label}
            </Text>
            {isActive && (
              <View style={styles.check}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: spacing.xs,
  },
  previewBlock: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
});
