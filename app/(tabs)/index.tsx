// ============================================================
// 专注页 — 番茄钟计时器（完整实现）
// ============================================================
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QuoteBanner } from '../../src/components/encouragement/QuoteBanner';
import { ProgressRing } from '../../src/components/timer/ProgressRing';
import { TimerDisplay } from '../../src/components/timer/TimerDisplay';
import { TimerControls } from '../../src/components/timer/TimerControls';
import { SessionTypeSelector } from '../../src/components/timer/SessionTypeSelector';
import { WhiteNoisePlayer } from '../../src/components/timer/WhiteNoisePlayer';
import { DailyGoalRing } from '../../src/components/habits/DailyGoalRing';
import { Card } from '../../src/components/ui/Card';
import { colors, spacing, typography } from '../../src/constants/theme';
import { useTimer } from '../../src/hooks/useTimer';
import { useHabitContext } from '../../src/context/HabitContext';
import { useSettingsContext } from '../../src/context/SettingsContext';
import { useTimerContext } from '../../src/context/TimerContext';
import { useAchievementContext } from '../../src/context/AchievementContext';
import { useCallback, useEffect, useRef } from 'react';

export default function FocusScreen() {
  const {
    state,
    progress,
    remainingMinutes,
    remainingSecs,
    start,
    pause,
    resume,
    reset,
    skip,
    switchType,
  } = useTimer();

  const { state: timerCtx } = useTimerContext();
  const { state: habitState } = useHabitContext();
  const { settings } = useSettingsContext();
  const { dispatch: achievementDispatch } = useAchievementContext();
  const router = useRouter();
  const prevSessionRef = useRef(false);
  const prevStreakRef = useRef(habitState.streakInfo.currentStreak);

  const todayDone = timerCtx.todaySessions.filter((s) => s.type === 'focus').length;
  const dailyGoal = settings.dailyFocusGoal;
  const hasStarted = state.startTimestamp !== null || state.isPaused;

  // ---- 连胜成就同步 ----
  useEffect(() => {
    const streak = habitState.streakInfo.currentStreak;
    if (streak !== prevStreakRef.current && streak > 0) {
      prevStreakRef.current = streak;
      achievementDispatch({
        type: 'UPDATE_PROGRESS',
        payload: { key: 'streak_3', progress: streak },
      });
      achievementDispatch({
        type: 'UPDATE_PROGRESS',
        payload: { key: 'streak_7', progress: streak },
      });
      achievementDispatch({
        type: 'UPDATE_PROGRESS',
        payload: { key: 'streak_30', progress: streak },
      });
    }
  }, [habitState.streakInfo.currentStreak, achievementDispatch]);

  // 当会话自动完成时，跳转到庆祝页
  useEffect(() => {
    if (state.sessionType !== 'focus' && hasStarted === false && prevSessionRef.current) {
      // 专注会话刚刚结束 → 跳转庆祝
      router.push('/modal/session-complete');
    }
    prevSessionRef.current = state.sessionType === 'focus' && state.isRunning;
  }, [state.sessionType, state.isRunning, hasStarted, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuoteBanner context="focus" />

        {/* 快捷操作栏 */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/modal/focus-stats')}
            activeOpacity={0.7}
          >
            <Ionicons name="stats-chart-outline" size={18} color={colors.primary} />
            <Text style={styles.actionText}>统计</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => router.push('/modal/focus-room')}
            activeOpacity={0.7}
          >
            <Ionicons name="expand-outline" size={18} color={colors.textInverse} />
            <Text style={[styles.actionText, { color: colors.textInverse }]}>
              专注房间
            </Text>
          </TouchableOpacity>
        </View>

        {/* 计时器核心区域 */}
        <View style={styles.timerSection}>
          <ProgressRing
            progress={progress}
            size={260}
            strokeWidth={6}
            sessionType={state.sessionType}
          >
            <TimerDisplay
              minutes={remainingMinutes}
              seconds={remainingSecs}
              sessionType={state.sessionType}
              isRunning={state.isRunning}
              isPaused={state.isPaused}
            />
          </ProgressRing>
        </View>

        {/* 控制按钮 */}
        <TimerControls
          isRunning={state.isRunning}
          isPaused={state.isPaused}
          hasStarted={hasStarted}
          onStart={start}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          onSkip={skip}
        />

        {/* 会话类型选择 */}
        <View style={styles.typeSection}>
          <SessionTypeSelector
            selected={state.sessionType}
            onSelect={switchType}
            disabled={state.isRunning}
          />
        </View>

        {/* 白噪音播放器 */}
        <View style={styles.noiseSection}>
          <WhiteNoisePlayer />
        </View>

        {/* 今日统计 */}
        <View style={styles.infoRow}>
          <Card style={styles.infoCard}>
            <DailyGoalRing completed={todayDone} goal={dailyGoal} />
          </Card>
          <Card style={styles.infoCard}>
            <View style={styles.streakBox}>
              <View style={styles.streakRow}>
                <View style={styles.streakItem}>
                  <View style={styles.statTextRow}>
                    <View style={[styles.statDot, { backgroundColor: colors.streakFlame }]} />
                    <Text style={styles.statNum}>{habitState.streakInfo.currentStreak}</Text>
                  </View>
                  <Text style={styles.statLabel}>连续天数</Text>
                </View>
                <View style={styles.streakItem}>
                  <View style={styles.statTextRow}>
                    <View style={[styles.statDot, { backgroundColor: colors.primary }]} />
                    <Text style={styles.statNum}>{habitState.streakInfo.longestStreak}</Text>
                  </View>
                  <Text style={styles.statLabel}>最佳记录</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.primaryBg,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary,
  },
  actionText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  timerSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  typeSection: {
    paddingVertical: spacing.md,
  },
  noiseSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  streakBox: {
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  streakItem: {
    alignItems: 'center',
  },
  statTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statNum: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
