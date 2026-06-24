// ============================================================
// HabitGoalCard — 打卡目标卡片
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';
import { HABIT_GOAL_CATEGORIES } from '../../types';
import type { HabitGoal } from '../../types';

interface HabitGoalCardProps {
  goal: HabitGoal;
  todayCount: number;
  targetCount: number;
  streak: number;
  onPress: () => void;
  onCheckIn: () => void;
}

export function HabitGoalCard({
  goal,
  todayCount,
  targetCount,
  streak,
  onPress,
  onCheckIn,
}: HabitGoalCardProps) {
  const catConfig = HABIT_GOAL_CATEGORIES[goal.category];
  const progress = Math.min(1, todayCount / targetCount);
  const isDone = todayCount >= targetCount;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.container, isDone && styles.containerDone]}>
        {/* 头部：图标 + 信息 */}
        <View style={styles.topRow}>
          <View style={styles.iconBox}>
            <Ionicons
              name={goal.icon as any}
              size={24}
              color={isDone ? colors.success : (goal.color ?? colors.primary)}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {goal.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.catBadge, { color: catConfig.color }]}>
                {catConfig.emoji} {catConfig.label}
              </Text>
              {streak > 0 && (
                <Text style={styles.streakText}>
                  🔥 {streak} 天
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* 进度条 */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%` as unknown as number,
                  backgroundColor: isDone ? colors.success : (goal.color ?? colors.primary),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {todayCount}/{targetCount} 次
          </Text>
        </View>

        {/* 激励语 + 打卡按钮 */}
        <View style={styles.bottomRow}>
          {goal.motivationalMessage && !isDone ? (
            <Text style={styles.motivation} numberOfLines={1}>
              💬 {goal.motivationalMessage}
            </Text>
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={onCheckIn}
            disabled={isDone}
            style={[
              styles.checkInBtn,
              isDone && styles.checkInBtnDone,
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDone ? 'checkmark-circle' : 'add-circle-outline'}
              size={20}
              color={isDone ? colors.textInverse : colors.textInverse}
            />
            <Text style={styles.checkInText}>
              {isDone ? '已完成' : '打卡'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  containerDone: {
    backgroundColor: colors.successLight + '30',
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  catBadge: {
    ...typography.caption,
    fontWeight: '500',
  },
  streakText: {
    ...typography.caption,
    color: colors.accent,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.textTertiary,
    minWidth: 50,
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motivation: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
    marginRight: spacing.sm,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  checkInBtnDone: {
    backgroundColor: colors.success,
  },
  checkInText: {
    ...typography.badge,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
