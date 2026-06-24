// ============================================================
// 打卡目标详情 Modal
// ============================================================
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HabitGoalCard } from '../../src/components/habits/HabitGoalCard';
import { HabitTrendChart } from '../../src/components/habits/HabitTrendChart';
import { HabitWeekGrid } from '../../src/components/habits/HabitWeekGrid';
import { MakeupOverlay } from '../../src/components/habits/MakeupOverlay';
import { SessionHistoryList } from '../../src/components/timer/SessionHistoryList';
import { Button } from '../../src/components/ui/Button';
import { useHabitGoals } from '../../src/hooks/useHabitGoals';
import { useTimerContext } from '../../src/context/TimerContext';
import { colors, spacing, typography } from '../../src/constants/theme';
import { formatDate } from '../../src/utils/dates';
import { useState } from 'react';

export default function HabitDetailModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const {
    goals,
    checkIns,
    getTodayCheckIn,
    getStreak,
    getWeekCheckIns,
    getMakeupDates,
    checkIn,
    makeupCheckIn,
    deleteGoal,
    toggleArchive,
  } = useHabitGoals();
  const { state: timerCtx } = useTimerContext();

  const [showMakeup, setShowMakeup] = useState(false);

  const goal = goals.find((g) => g.id === params.id);

  if (!goal) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>目标不存在</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.goBack}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const todayCheckIn = getTodayCheckIn(goal.id);
  const todayCount = todayCheckIn?.count ?? 0;
  const streak = getStreak(goal.id);
  const weekData = getWeekCheckIns(goal.id);
  const makeupDates = getMakeupDates(goal.id);

  const handleDelete = () => {
    Alert.alert('删除目标', `确认删除「${goal.title}」？\n所有打卡记录也将被删除。`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => { deleteGoal(goal.id); router.back(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>目标详情</Text>
        <TouchableOpacity onPress={() => { router.push(`/modal/add-habit-goal?id=${goal.id}`); }} hitSlop={8}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 目标卡片（可打卡） */}
        <HabitGoalCard
          goal={goal}
          todayCount={todayCount}
          targetCount={goal.targetCount}
          streak={streak}
          onPress={() => {}}
          onCheckIn={() => checkIn(goal.id)}
        />

        {/* 操作按钮 */}
        <View style={styles.actionRow}>
          <Button
            title="📅 补卡"
            onPress={() => setShowMakeup(true)}
            variant="outline"
            size="sm"
            disabled={makeupDates.length === 0}
          />
          <Button
            title={goal.isArchived ? '📂 取消归档' : '📁 归档'}
            onPress={() => toggleArchive(goal.id)}
            variant="outline"
            size="sm"
          />
          <Button
            title="🗑️ 删除"
            onPress={handleDelete}
            variant="ghost"
            size="sm"
            textStyle={{ color: colors.error }}
          />
        </View>

        {/* 本周打卡网格 */}
        {goal.description && (
          <View style={styles.sectionHeader}>
            <Text style={styles.description}>📝 {goal.description}</Text>
          </View>
        )}
        <Text style={styles.sectionTitle}>本周打卡</Text>
        <HabitWeekGrid
          weekData={weekData}
          targetCount={goal.targetCount}
          isToday={(date) => date === formatDate()}
        />

        {/* 打卡趋势图 */}
        <HabitTrendChart goal={goal} checkIns={checkIns} />

        {/* 最近专注会话（如有关联） */}
        <SessionHistoryList sessions={timerCtx.allSessions} limit={5} />
      </ScrollView>

      {/* 补卡弹窗 */}
      <MakeupOverlay
        visible={showMakeup}
        makeupDates={makeupDates}
        onMakeup={(date, note) => { makeupCheckIn(goal.id, date, note); setShowMakeup(false); }}
        onClose={() => setShowMakeup(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabBarBorder,
  },
  topTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  goBack: {
    ...typography.button,
    color: colors.primary,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  sectionHeader: {
    paddingHorizontal: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  sectionTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
