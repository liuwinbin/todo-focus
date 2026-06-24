// ============================================================
// TimerControls — 开始/暂停/重置/跳过按钮
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { spacing } from '../../constants/theme';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  hasStarted,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <View style={styles.container}>
      {/* 主按钮：开始 / 暂停 / 继续 */}
      {!hasStarted && !isPaused && (
        <Button
          title="开始专注"
          onPress={onStart}
          variant="primary"
          size="lg"
          style={styles.mainBtn}
        />
      )}
      {isRunning && (
        <Button
          title="暂停"
          onPress={onPause}
          variant="secondary"
          size="lg"
          style={styles.mainBtn}
        />
      )}
      {isPaused && (
        <View style={styles.pausedRow}>
          <Button
            title="继续"
            onPress={onResume}
            variant="primary"
            size="lg"
            style={styles.pausedBtn}
          />
          <Button
            title="结束"
            onPress={onSkip}
            variant="outline"
            size="lg"
            style={styles.pausedBtn}
          />
        </View>
      )}

      {/* 重置按钮 */}
      {hasStarted && (
        <Button
          title="重置"
          onPress={onReset}
          variant="ghost"
          size="sm"
          style={styles.resetBtn}
        />
      )}

      {/* 跳过按钮（专注中可跳过） */}
      {isRunning && (
        <Button
          title="跳过 ›"
          onPress={onSkip}
          variant="ghost"
          size="sm"
          style={styles.skipBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  mainBtn: {
    minWidth: 180,
  },
  pausedRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pausedBtn: {
    minWidth: 120,
  },
  resetBtn: {
    marginTop: spacing.sm,
  },
  skipBtn: {
    marginTop: spacing.xs,
  },
});
