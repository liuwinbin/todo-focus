// ============================================================
// DailyCheckInList — 今日已打卡列表
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { HABIT_GOAL_CATEGORIES } from '../../types';
import type { HabitGoal, HabitCheckIn } from '../../types';

interface DailyCheckInListProps {
  goals: HabitGoal[];
  todayCheckIns: HabitCheckIn[];
  onGoalPress: (goal: HabitGoal) => void;
}

export function DailyCheckInList({ goals, todayCheckIns, onGoalPress }: DailyCheckInListProps) {
  if (todayCheckIns.length === 0) return null;

  return (
    <View>
      <SectionHeader title="今日打卡" actionLabel="" onAction={undefined} />
      <Card style={styles.container} padding={0}>
        {todayCheckIns.map((checkIn, i) => {
          const goal = goals.find((g) => g.id === checkIn.goalId);
          if (!goal) return null;
          const catConfig = HABIT_GOAL_CATEGORIES[goal.category];

          return (
            <TouchableOpacity
              key={checkIn.id}
              onPress={() => onGoalPress(goal)}
              activeOpacity={0.7}
              style={[
                styles.item,
                i < todayCheckIns.length - 1 && styles.itemBorder,
              ]}
            >
              <View style={styles.iconBox}>
                <Ionicons name={goal.icon as any} size={18} color={goal.color ?? colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{goal.title}</Text>
                <Text style={styles.meta}>
                  {catConfig.emoji} {catConfig.label}
                  {checkIn.isMakeup && ' · 📅 补卡'}
                  {checkIn.note ? ` · ${checkIn.note}` : ''}
                </Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: (goal.color ?? colors.primary) + '20' }]}>
                <Text style={[styles.countText, { color: goal.color ?? colors.primary }]}>
                  {checkIn.count} 次
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  itemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.tabBarBorder,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 1,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  countText: {
    ...typography.badge,
    fontWeight: '600',
  },
});
