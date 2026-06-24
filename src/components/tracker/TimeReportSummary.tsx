// ============================================================
// TimeReportSummary — 时间报告摘要卡片
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import { TIME_LOG_CATEGORIES } from '../../types';
import type { TimeLogCategory } from '../../types';

interface CategoryPercent {
  category: TimeLogCategory;
  emoji: string;
  label: string;
  color: string;
  minutes: number;
  percentage: number;
}

interface TimeReportSummaryProps {
  categoryPercentages: CategoryPercent[];
  topCategory: { category: TimeLogCategory; emoji: string; label: string; color: string; minutes: number };
  dailyAverage: number;
}

export function TimeReportSummary({
  categoryPercentages,
  topCategory,
  dailyAverage,
}: TimeReportSummaryProps) {
  const avgHours = Math.round((dailyAverage / 60) * 10) / 10;

  return (
    <Card style={styles.container} padding={0}>
      {/* 摘要头部 */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
          <Text style={styles.summaryValue}>{avgHours}h</Text>
          <Text style={styles.summaryLabel}>日均时长</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={{ fontSize: 28 }}>{topCategory.emoji}</Text>
          <Text style={styles.summaryValue}>{topCategory.label}</Text>
          <Text style={styles.summaryLabel}>最多分类</Text>
        </View>
      </View>

      {/* 分类占比条 */}
      {categoryPercentages.length > 0 && (
        <View style={styles.percentageSection}>
          {categoryPercentages
            .filter((c) => c.minutes > 0)
            .sort((a, b) => b.percentage - a.percentage)
            .map((item) => (
              <View key={item.category} style={styles.percentageRow}>
                <View style={styles.percentageLabel}>
                  <Text style={styles.percentageEmoji}>{item.emoji}</Text>
                  <Text style={styles.percentageName}>{item.label}</Text>
                </View>
                <View style={styles.percentageTrack}>
                  <View
                    style={[
                      styles.percentageFill,
                      {
                        width: `${item.percentage}%` as unknown as number,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.percentageValue}>{item.percentage}%</Text>
              </View>
            ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.tabBarBorder,
  },
  percentageSection: {
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    padding: spacing.md,
    gap: spacing.sm,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  percentageLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  percentageEmoji: {
    fontSize: 14,
  },
  percentageName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  percentageTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentageValue: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
});
