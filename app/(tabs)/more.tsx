// ============================================================
// 更多 Tab — 主题、倒数日、笔记、提醒、设置
// ============================================================
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ThemePicker } from '../../src/components/more/ThemePicker';
import { LunarDateDisplay } from '../../src/components/more/LunarDateDisplay';
import { CountdownCard } from '../../src/components/more/CountdownCard';
import { NoteCard } from '../../src/components/more/NoteCard';
import { ReminderSettings } from '../../src/components/more/ReminderSettings';
import { StreakCounter } from '../../src/components/habits/StreakCounter';
import { StatsSummary } from '../../src/components/habits/StatsSummary';
import { HeatmapCalendar } from '../../src/components/habits/HeatmapCalendar';
import { HabitGoalCard } from '../../src/components/habits/HabitGoalCard';
import { DailyCheckInList } from '../../src/components/habits/DailyCheckInList';
import { AchievementBadge } from '../../src/components/habits/AchievementBadge';
import { AchievementUnlockOverlay } from '../../src/components/habits/AchievementUnlockOverlay';
import { QuickTimeLogger } from '../../src/components/tracker/QuickTimeLogger';
import { TimeLogList } from '../../src/components/tracker/TimeLogList';
import { useSettingsContext } from '../../src/context/SettingsContext';
import { useTimerContext } from '../../src/context/TimerContext';
import { useCountdowns } from '../../src/hooks/useCountdowns';
import { useNotes } from '../../src/hooks/useNotes';
import { useHabits } from '../../src/hooks/useHabits';
import { useHabitGoals } from '../../src/hooks/useHabitGoals';
import { useAchievements } from '../../src/hooks/useAchievements';
import { useTimeLog } from '../../src/hooks/useTimeLog';
import { colors, spacing, typography, borderRadius } from '../../src/constants/theme';
import type { ThemeId, HabitGoal } from '../../src/types';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function MoreScreen() {
  const { settings, dispatch } = useSettingsContext();
  const { sortedCountdowns, deleteCountdown } = useCountdowns();
  const { sortedNotes, deleteNote } = useNotes();
  const { streakInfo, calendarDays, totalFocusMinutes, totalTasks } = useHabits();
  const { state: timerState } = useTimerContext();
  const { activeGoals, todayCheckIns, getTodayCheckIn, getStreak, checkIn } = useHabitGoals();
  const { unlockedAchievements, latestUnlock, clearLatest } = useAchievements();
  const { entries, addEntry, deleteEntry } = useTimeLog();

  const totalSessions = timerState.allSessions.filter(
    (s) => s.type === 'focus' && s.completed,
  ).length;

  const handleThemeSelect = (id: ThemeId) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { themeId: id } });
  };

  const handleReset = () => {
    Alert.alert(
      '重置所有数据',
      '这会清除所有任务、专注记录、统计数据、倒数日和笔记。此操作不可撤销！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认重置',
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_ALL' }),
        },
      ],
    );
  };

  const handleDeleteCountdown = (id: string, title: string) => {
    Alert.alert('删除', `确定删除「${title}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteCountdown(id) },
    ]);
  };

  const handleDeleteNote = (id: string, title: string) => {
    Alert.alert('删除', `确定删除「${title || '无标题'}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  };

  const DurationStepper = ({
    label,
    value,
    onIncrement,
    onDecrement,
  }: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
  }) => (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Button title="−" onPress={onDecrement} variant="outline" size="sm" style={styles.stepperBtn} />
        <Text style={styles.stepperValue}>{value} 分钟</Text>
        <Button title="+" onPress={onIncrement} variant="primary" size="sm" style={styles.stepperBtn} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>更多</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ---- 农历日期 ---- */}
        <SectionHeader title="📅 今日" />
        <View style={styles.sectionPad}>
          <LunarDateDisplay />
        </View>

        {/* ---- 我的进展（from habits）---- */}
        <SectionHeader title="🔥 我的进展" />
        <StreakCounter
          currentStreak={streakInfo.currentStreak}
          longestStreak={streakInfo.longestStreak}
          dailyGoal={streakInfo.dailyGoal}
        />
        <StatsSummary
          totalFocusMinutes={totalFocusMinutes}
          totalSessions={totalSessions}
          totalTasks={totalTasks}
          currentStreak={streakInfo.currentStreak}
        />

        {/* ---- 今日打卡 ---- */}
        <SectionHeader title="✅ 今日打卡" />
        <DailyCheckInList
          goals={activeGoals}
          todayCheckIns={todayCheckIns}
          onGoalPress={(goal: HabitGoal) => router.push(`/modal/habit-detail?id=${goal.id}`)}
        />

        {/* ---- 打卡目标 ---- */}
        <SectionHeader
          title="🎯 打卡目标"
          actionLabel="+ 新建"
          onAction={() => router.push('/modal/add-habit-goal')}
        />
        <View style={styles.sectionPad}>
          {activeGoals.length === 0 ? (
            <EmptyState icon="checkbox-outline" title="还没有打卡目标" subtitle="创建每日打卡，养成好习惯" />
          ) : (
            <View style={styles.goalsGrid}>
              {activeGoals.slice(0, 4).map((goal) => {
                const ci = getTodayCheckIn(goal.id);
                return (
                  <HabitGoalCard
                    key={goal.id}
                    goal={goal}
                    todayCount={ci?.count ?? 0}
                    targetCount={goal.targetCount}
                    streak={getStreak(goal.id)}
                    onPress={() => router.push(`/modal/habit-detail?id=${goal.id}`)}
                    onCheckIn={() => checkIn(goal.id)}
                  />
                );
              })}
              {activeGoals.length > 4 && (
                <TouchableOpacity onPress={() => router.push('/modal/habit-detail')}>
                  <Text style={styles.moreHint}>还有 {activeGoals.length - 4} 个目标...</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* ---- 成就 ---- */}
        {unlockedAchievements.length > 0 && (
          <>
            <SectionHeader title="🏆 成就" actionLabel="查看全部" onAction={() => router.push('/modal/badges')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementRow}>
              {unlockedAchievements.slice(0, 6).map((a) => (
                <AchievementBadge key={a.key} achievement={a} size="sm" />
              ))}
            </ScrollView>
          </>
        )}

        {/* ---- 专注热力图 ---- */}
        <SectionHeader title="📊 专注热力图" />
        <HeatmapCalendar data={calendarDays} weeks={12} />

        {/* ---- 倒数日 ---- */}
        <SectionHeader
          title="⏳ 倒数日"
          actionLabel="+ 添加"
          onAction={() => router.push('/modal/add-countdown')}
        />
        <View style={styles.sectionPad}>
          {sortedCountdowns.length === 0 ? (
            <EmptyState
              icon="calendar-outline"  // Cast below avoids ts narrowing issue
              title="还没有倒数日"
              subtitle="记录重要的日子"
              actionLabel="添加倒数日"
              onAction={() => router.push('/modal/add-countdown')}
            />
          ) : (
            <View style={styles.listGap}>
              {sortedCountdowns.slice(0, 5).map((item) => (
                <CountdownCard
                  key={item.id}
                  item={item}
                  onPress={() => router.push({ pathname: '/modal/add-countdown', params: { id: item.id } })}
                  onLongPress={() => handleDeleteCountdown(item.id, item.title)}
                />
              ))}
              {sortedCountdowns.length > 5 && (
                <Text style={styles.moreHint}>还有 {sortedCountdowns.length - 5} 个倒数日...</Text>
              )}
            </View>
          )}
        </View>

        {/* ---- 时间追踪（from tracker）---- */}
        <SectionHeader title="⏱️ 时间追踪" actionLabel="+ 记录" onAction={() => router.push('/modal/add-time-entry')} />
        <View style={styles.sectionPad}>
          <QuickTimeLogger
            onQuickLog={(data) => addEntry({
              category: data.category,
              title: data.title,
              durationMinutes: data.durationMinutes ?? 25,
              startedAt: new Date().toISOString(),
            })}
            onCustomLog={() => router.push('/modal/add-time-entry')}
          />
          <TimeLogList entries={entries.slice(0, 5)} onEntryDelete={deleteEntry} onEntryPress={() => {}} />
          {entries.length > 5 && (
            <Text style={styles.moreHint}>还有 {entries.length - 5} 条记录...</Text>
          )}
        </View>

        {/* ---- 灵感笔记 ---- */}
        <SectionHeader
          title="💡 灵感笔记"
          actionLabel="+ 新建"
          onAction={() => router.push('/modal/add-note')}
        />
        <View style={styles.sectionPad}>
          {sortedNotes.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title="还没有笔记"
              subtitle="记录一闪而过的灵感"
              actionLabel="新建笔记"
              onAction={() => router.push('/modal/add-note')}
            />
          ) : (
            <View style={styles.listGap}>
              {sortedNotes.slice(0, 5).map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPress={() => router.push({ pathname: '/modal/add-note', params: { id: note.id } })}
                  onLongPress={() => handleDeleteNote(note.id, note.title)}
                />
              ))}
              {sortedNotes.length > 5 && (
                <Text style={styles.moreHint}>还有 {sortedNotes.length - 5} 条笔记...</Text>
              )}
            </View>
          )}
        </View>

        {/* ---- 每日提醒 ---- */}
        <SectionHeader title="🔔 专注提醒" />
        <View style={styles.sectionPad}>
          <ReminderSettings
            enabled={settings.reminderEnabled}
            time={settings.reminderTime}
            onToggle={(v) =>
              dispatch({ type: 'UPDATE_SETTING', payload: { reminderEnabled: v } })
            }
            onTimeChange={(v) =>
              dispatch({ type: 'UPDATE_SETTING', payload: { reminderTime: v } })
            }
          />
        </View>

        {/* ---- 主题 ---- */}
        <SectionHeader
          title="🎨 主题换肤"
          actionLabel="查看全部"
          onAction={() => router.push('/modal/themes')}
        />
        <View style={styles.sectionPad}>
          <ThemePicker selected={settings.themeId} onSelect={handleThemeSelect} />
        </View>

        {/* ---- 计时器设置 ---- */}
        <SectionHeader title="⏱️ 计时器设置" />
        <Card style={styles.card}>
          <DurationStepper
            label="专注时长"
            value={settings.focusDuration}
            onIncrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { focusDuration: Math.min(90, settings.focusDuration + 5) },
              })
            }
            onDecrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { focusDuration: Math.max(5, settings.focusDuration - 5) },
              })
            }
          />
          <View style={styles.divider} />
          <DurationStepper
            label="短休息"
            value={settings.shortBreakDuration}
            onIncrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { shortBreakDuration: Math.min(30, settings.shortBreakDuration + 1) },
              })
            }
            onDecrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { shortBreakDuration: Math.max(1, settings.shortBreakDuration - 1) },
              })
            }
          />
          <View style={styles.divider} />
          <DurationStepper
            label="长休息"
            value={settings.longBreakDuration}
            onIncrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { longBreakDuration: Math.min(45, settings.longBreakDuration + 5) },
              })
            }
            onDecrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { longBreakDuration: Math.max(5, settings.longBreakDuration - 5) },
              })
            }
          />
        </Card>

        {/* ---- 每日目标 ---- */}
        <Card style={styles.card}>
          <DurationStepper
            label="每日专注次数"
            value={settings.dailyFocusGoal}
            onIncrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { dailyFocusGoal: Math.min(12, settings.dailyFocusGoal + 1) },
              })
            }
            onDecrement={() =>
              dispatch({
                type: 'UPDATE_SETTING',
                payload: { dailyFocusGoal: Math.max(1, settings.dailyFocusGoal - 1) },
              })
            }
          />
        </Card>

        {/* ---- 偏好 ---- */}
        <SectionHeader title="⚙️ 偏好设置" />
        <Card style={styles.card}>
          <View style={styles.toggleRow}>
            <Text style={styles.stepperLabel}>声音提醒</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) =>
                dispatch({ type: 'UPDATE_SETTING', payload: { soundEnabled: v } })
              }
              trackColor={{ false: colors.tabBarBorder, true: colors.primaryLight }}
              thumbColor={settings.soundEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <Text style={styles.stepperLabel}>震动反馈</Text>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(v) =>
                dispatch({ type: 'UPDATE_SETTING', payload: { vibrationEnabled: v } })
              }
              trackColor={{ false: colors.tabBarBorder, true: colors.primaryLight }}
              thumbColor={settings.vibrationEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
        </Card>

        {/* ---- 数据管理 ---- */}
        <SectionHeader title="🗂️ 数据管理" />
        <Card style={styles.card}>
          <Button
            title="重置所有数据"
            onPress={handleReset}
            variant="outline"
            size="md"
            style={styles.resetBtn}
            textStyle={{ color: colors.error }}
          />
        </Card>

        {/* 页脚 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>专注番茄钟 v1.0</Text>
          <Text style={styles.footerText}>用专注战胜拖延 ✨</Text>
        </View>
      </ScrollView>

      {/* 成就解锁庆祝弹窗 */}
      <AchievementUnlockOverlay achievement={latestUnlock} onDismiss={clearLatest} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  pageTitle: {
    ...typography.heading1,
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + spacing.lg,
  },
  sectionPad: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  listGap: {
    gap: spacing.sm,
  },
  moreHint: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  stepperLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepperValue: {
    ...typography.body,
    color: colors.textPrimary,
    minWidth: 70,
    textAlign: 'center',
    fontWeight: '600',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    padding: 0,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.tabBarBorder,
    marginVertical: spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resetBtn: {
    borderColor: colors.error,
    marginTop: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  goalsGrid: {
    gap: spacing.md,
  },
  achievementRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
});
