// ============================================================
// useTimer — 番茄钟计时器核心 Hook
// ============================================================
import { useState, useRef, useCallback, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';
import { playCompletionSound } from '../utils/sounds';
import { generateId, formatDate } from '../utils/dates';
import { useSettingsContext } from '../context/SettingsContext';
import { useTimerContext } from '../context/TimerContext';
import { useHabitContext } from '../context/HabitContext';
import { useItemContext } from '../context/ItemContext';
import { useAchievementContext } from '../context/AchievementContext';
import type { TimerState, SessionType } from '../types';

export function useTimer() {
  const { settings } = useSettingsContext();
  const { state: timerCtx, dispatch: timerDispatch } = useTimerContext();
  const { dispatch: habitDispatch } = useHabitContext();
  const { dispatch: taskDispatch } = useItemContext();
  const { dispatch: achievementDispatch } = useAchievementContext();

  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    sessionType: 'focus',
    totalSeconds: settings.focusDuration * 60,
    remainingSeconds: settings.focusDuration * 60,
    startTimestamp: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionCountRef = useRef(0);              // 已完成专注数（用于长休息判断）
  const activeTaskIdRef = useRef<string | null>(null);
  const pausedAtRef = useRef<number | null>(null); // 后台暂停时间戳

  // ---- 清理 interval ----
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ---- 根据类型获取时长（秒） ----
  const getDuration = useCallback(
    (type: SessionType): number => {
      switch (type) {
        case 'focus':
          return settings.focusDuration * 60;
        case 'shortBreak':
          return settings.shortBreakDuration * 60;
        case 'longBreak':
          return settings.longBreakDuration * 60;
      }
    },
    [settings],
  );

  // ---- 开始计时 ----
  const start = useCallback(() => {
    setState((prev) => {
      const now = Date.now();
      return {
        ...prev,
        isRunning: true,
        isPaused: false,
        startTimestamp: now,
      };
    });
  }, []);

  // ---- 暂停 ----
  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isRunning: false, isPaused: true }));
  }, [clearTimer]);

  // ---- 恢复 ----
  const resume = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTimestamp: Date.now(),
    }));
  }, []);

  // ---- 重置 ----
  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => {
      const total = getDuration(prev.sessionType);
      return {
        ...prev,
        isRunning: false,
        isPaused: false,
        totalSeconds: total,
        remainingSeconds: total,
        startTimestamp: null,
      };
    });
  }, [clearTimer, getDuration]);

  // ---- 切换会话类型 ----
  const switchType = useCallback(
    (type: SessionType) => {
      clearTimer();
      const total = getDuration(type);
      setState({
        isRunning: false,
        isPaused: false,
        sessionType: type,
        totalSeconds: total,
        remainingSeconds: total,
        startTimestamp: null,
      });
    },
    [clearTimer, getDuration],
  );

  // ---- 跳过（提前结束） ----
  const skip = useCallback(() => {
    clearTimer();
    setState((prev) => {
      // 记录已跳过的会话
      const now = new Date().toISOString();
      const plannedDuration = prev.totalSeconds;
      const actualDuration = plannedDuration - prev.remainingSeconds;

      timerDispatch({
        type: 'ADD_SESSION',
        payload: {
          type: prev.sessionType,
          plannedDuration,
          actualDuration,
          completed: false,
          taskId: activeTaskIdRef.current ?? undefined,
        },
      });

      // 切换到下一个类型
      let nextType: SessionType = 'focus';
      if (prev.sessionType === 'focus') {
        sessionCountRef.current += 1;
        if (sessionCountRef.current % settings.longBreakInterval === 0) {
          nextType = 'longBreak';
        } else {
          nextType = 'shortBreak';
        }
      }

      const total = getDuration(nextType);
      return {
        isRunning: false,
        isPaused: false,
        sessionType: nextType,
        totalSeconds: total,
        remainingSeconds: total,
        startTimestamp: null,
      };
    });
  }, [clearTimer, timerDispatch, settings.longBreakInterval, getDuration]);

  // ---- 设置关联任务 ----
  const setActiveTask = useCallback((taskId: string | null) => {
    activeTaskIdRef.current = taskId;
  }, []);

  // ---- 计时核心：每秒递减 ----
  useEffect(() => {
    if (!state.isRunning) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const elapsed = prev.startTimestamp ? Math.floor((Date.now() - prev.startTimestamp) / 1000) : 0;
        const remaining = Math.max(0, prev.totalSeconds - elapsed);

        if (remaining <= 0) {
          // 会话完成！
          clearTimer();

          const now = new Date().toISOString();
          const plannedDuration = prev.totalSeconds;

          // 记录到 TimerContext
          timerDispatch({
            type: 'ADD_SESSION',
            payload: {
              type: prev.sessionType,
              plannedDuration,
              actualDuration: plannedDuration,
              completed: true,
              taskId: activeTaskIdRef.current ?? undefined,
            },
          });

          // 如果是专注会话，更新习惯数据
          if (prev.sessionType === 'focus') {
            sessionCountRef.current += 1;
            habitDispatch({
              type: 'RECORD_SESSION',
              payload: { focusMinutes: Math.round(plannedDuration / 60) },
            });

            // 增加关联任务的番茄计数
            if (activeTaskIdRef.current) {
              taskDispatch({
                type: 'INCREMENT_POMODORO',
                payload: activeTaskIdRef.current,
              });
            }

            // ---- 成就检查：累计专注时长 ----
            const totalFocusMin = timerCtx.allSessions
              .filter((s) => s.type === 'focus' && s.completed)
              .reduce((sum, s) => sum + Math.round(s.actualDuration / 60), 0)
              + Math.round(plannedDuration / 60); // 加上本次

            achievementDispatch({
              type: 'UPDATE_PROGRESS',
              payload: { key: 'focus_10h', progress: totalFocusMin },
            });
            achievementDispatch({
              type: 'UPDATE_PROGRESS',
              payload: { key: 'focus_50h', progress: totalFocusMin },
            });

            // ---- 成就检查：早起鸟儿 / 夜猫子 ----
            const currentHour = new Date().getHours();
            if (currentHour < 6) {
              achievementDispatch({ type: 'UNLOCK', payload: { key: 'early_bird' } });
            }
            if (currentHour >= 22) {
              achievementDispatch({ type: 'UNLOCK', payload: { key: 'night_owl' } });
            }
          }

          // Haptic 反馈
          if (settings.vibrationEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          }

          // 音效
          if (settings.soundEnabled) {
            playCompletionSound().catch(() => {});
          }

          // 自动切换
          let nextType: SessionType = 'focus';
          if (prev.sessionType === 'focus') {
            if (sessionCountRef.current % settings.longBreakInterval === 0) {
              nextType = 'longBreak';
            } else {
              nextType = 'shortBreak';
            }
          }

          const total = getDuration(nextType);
          return {
            isRunning: false,
            isPaused: false,
            sessionType: nextType,
            totalSeconds: total,
            remainingSeconds: total,
            startTimestamp: null,
          };
        }

        return { ...prev, remainingSeconds: remaining };
      });
    }, 200); // 200ms 更新一次，平衡流畅和性能

    return () => clearTimer();
  }, [
    state.isRunning,
    state.startTimestamp,
    clearTimer,
    timerDispatch,
    habitDispatch,
    taskDispatch,
    settings,
    getDuration,
  ]);

  // ---- 处理 APP 进入后台 ----
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active' && pausedAtRef.current) {
        // 回到前台，恢复计时
        const now = Date.now();
        const elapsed = Math.floor((now - pausedAtRef.current) / 1000);
        pausedAtRef.current = null;
        setState((prev) => {
          if (!prev.isPaused && prev.isRunning) {
            const remaining = Math.max(0, prev.remainingSeconds - elapsed);
            if (remaining <= 0) {
              clearTimer();
              return { ...prev, remainingSeconds: 0, isRunning: false };
            }
            return { ...prev, remainingSeconds: remaining, startTimestamp: now };
          }
          return prev;
        });
      } else if (nextState !== 'active' && state.isRunning) {
        // 进入后台，记录时间
        pausedAtRef.current = Date.now();
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [state.isRunning, clearTimer]);

  // ---- 清理 ----
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const progress = state.totalSeconds > 0
    ? (state.totalSeconds - state.remainingSeconds) / state.totalSeconds
    : 0;

  const remainingMinutes = Math.floor(state.remainingSeconds / 60);
  const remainingSecs = state.remainingSeconds % 60;

  return {
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
    setActiveTask,
  };
}
