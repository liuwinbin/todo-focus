// ============================================================
// QuoteBanner — 鼓励语横幅（使用鼓励系统）
// ============================================================
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { useEncouragement } from '../../hooks/useEncouragement';
import type { QuoteCategory } from '../../data/quotes';

interface QuoteBannerProps {
  context?: 'focus' | 'habits';
}

export function QuoteBanner({ context = 'focus' }: QuoteBannerProps) {
  const { currentQuote, refreshQuote } = useEncouragement();

  useEffect(() => {
    const category: QuoteCategory = context === 'focus' ? 'focus' : 'general';
    refreshQuote(category);
  }, [context]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{currentQuote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  text: {
    ...typography.quote,
    color: colors.primaryDark,
  },
});
