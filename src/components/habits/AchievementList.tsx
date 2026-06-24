// ============================================================
// AchievementList — 成就徽章列表（按分类分组）
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AchievementBadge } from './AchievementBadge';
import { Card } from '../ui/Card';
import { colors, spacing, typography } from '../../constants/theme';
import { ACHIEVEMENT_CATEGORY_CONFIG } from '../../types';
import type { Achievement, AchievementCategory } from '../../types';

interface AchievementListProps {
  achievementsByCategory: Record<AchievementCategory, Achievement[]>;
  totalUnlocked: number;
  totalCount: number;
}

export function AchievementList({
  achievementsByCategory,
  totalUnlocked,
  totalCount,
}: AchievementListProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 总体进度 */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <Ionicons name="trophy-outline" size={28} color={colors.badgeGold} />
            <View>
              <Text style={styles.summaryTitle}>成就收集</Text>
              <Text style={styles.summarySubtitle}>
                {totalUnlocked} / {totalCount} 已解锁
              </Text>
            </View>
          </View>
          <View style={styles.summaryTrack}>
            <View
              style={[
                styles.summaryFill,
                {
                  width: `${totalCount > 0 ? Math.round((totalUnlocked / totalCount) * 100) : 0}%` as unknown as number,
                },
              ]}
            />
          </View>
        </View>
      </Card>

      {/* 按分类 */}
      {(Object.entries(achievementsByCategory) as [AchievementCategory, Achievement[]][]).map(
        ([category, items]) => {
          const config = ACHIEVEMENT_CATEGORY_CONFIG[category];
          const unlockedCount = items.filter((a) => a.isUnlocked).length;

          return (
            <View key={category} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {config.emoji} {config.label}
                </Text>
                <Text style={styles.sectionCount}>
                  {unlockedCount}/{items.length}
                </Text>
              </View>
              <View style={styles.badgeGrid}>
                {items.map((achievement) => (
                  <AchievementBadge
                    key={achievement.key}
                    achievement={achievement}
                    size="sm"
                  />
                ))}
              </View>
            </View>
          );
        },
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    padding: spacing.md,
  },
  summaryRow: {
    gap: spacing.sm,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summarySubtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 1,
  },
  summaryTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  summaryFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.badgeGold,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionCount: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },
});
