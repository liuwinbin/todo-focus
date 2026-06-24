// ============================================================
// Card — 圆角卡片容器
// ============================================================
import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  noShadow?: boolean;
}

export function Card({ children, style, padding = spacing.md, noShadow = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { padding },
        !noShadow && shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
});
