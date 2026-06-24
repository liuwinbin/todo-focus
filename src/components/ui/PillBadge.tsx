// ============================================================
// PillBadge — 圆角标签
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface PillBadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function PillBadge({
  label,
  color = colors.textInverse,
  backgroundColor = colors.primary,
  size = 'sm',
  style,
}: PillBadgeProps) {
  return (
    <View
      style={[
        styles.base,
        { backgroundColor },
        size === 'sm' ? styles.sm : styles.md,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color },
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.badge,
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 13,
  },
});
