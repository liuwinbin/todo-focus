// ============================================================
// 会话完成庆祝页 — 带动画的完整庆祝
// ============================================================
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CelebrationOverlay } from '../../src/components/encouragement/CelebrationOverlay';
import { colors } from '../../src/constants/theme';
import { useTimerContext } from '../../src/context/TimerContext';
import { useHabitContext } from '../../src/context/HabitContext';
import { useSettingsContext } from '../../src/context/SettingsContext';
import { useCallback } from 'react';

export default function SessionCompleteModal() {
  const router = useRouter();
  const { state: timerState } = useTimerContext();
  const { state: habitState } = useHabitContext();
  const { settings } = useSettingsContext();

  // 最新完成的专注会话
  const lastFocus = timerState.allSessions.find(
    (s) => s.type === 'focus' && s.completed,
  );

  const focusMinutes = lastFocus
    ? Math.round(lastFocus.actualDuration / 60)
    : settings.focusDuration;

  const todayTotal = timerState.todaySessions.filter(
    (s) => s.type === 'focus',
  ).length;

  const handleDismiss = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={styles.container}>
      <CelebrationOverlay
        visible={true}
        focusMinutes={focusMinutes}
        todayTotal={todayTotal}
        streak={habitState.streakInfo.currentStreak}
        onDismiss={handleDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
