// ============================================================
// TimerDisplay — 大字号 MM:SS 倒计时
// ============================================================
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';
import type { SessionType } from '../../types';

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  sessionType: SessionType;
  isRunning: boolean;
  isPaused: boolean;
}

export function TimerDisplay({
  minutes,
  seconds,
  sessionType,
  isRunning,
  isPaused,
}: TimerDisplayProps) {
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');

  const color =
    sessionType === 'focus' ? colors.primary : colors.info;

  let label = '准备开始';
  if (isRunning) label = sessionType === 'focus' ? '专注中...' : '休息中...';
  else if (isPaused) label = '已暂停';

  return (
    <>
      <Text style={[styles.timer, { color }]}>
        {m}:{s}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  timer: {
    ...typography.timer,
    fontVariant: ['tabular-nums'],
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
