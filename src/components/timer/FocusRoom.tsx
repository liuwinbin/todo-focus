// ============================================================
// FocusRoom — 沉浸式专注房间（全屏）
// ============================================================
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from './ProgressRing';
import { TimerDisplay } from './TimerDisplay';
import { NoiseTrackCard } from './NoiseTrackCard';
import { useTimer } from '../../hooks/useTimer';
import { useWhiteNoise } from '../../hooks/useWhiteNoise';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function FocusRoom() {
  const router = useRouter();
  const {
    state,
    progress,
    remainingMinutes,
    remainingSecs,
    start,
    pause,
    resume,
    skip,
    switchType,
  } = useTimer();

  const { tracks, activeTrackId, isPlaying: noisePlaying, toggle } = useWhiteNoise();
  const [showNoisePanel, setShowNoisePanel] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hasStarted = state.startTimestamp !== null || state.isPaused;

  // 进入/退出动画
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const natureTracks = tracks.filter((t) => t.category === 'nature');
  const ambientTracks = tracks.filter((t) => t.category === 'ambient');

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* 顶部栏：退出 + 白噪音 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.exitBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
          <Text style={styles.exitText}>退出</Text>
        </TouchableOpacity>

        <View style={styles.topActions}>
          {/* 白噪音快捷切换 */}
          <TouchableOpacity
            onPress={() => setShowNoisePanel(!showNoisePanel)}
            style={[styles.noiseToggle, activeTrackId && noisePlaying && styles.noiseToggleActive]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={noisePlaying ? 'musical-notes' : 'musical-notes-outline'}
              size={16}
              color={activeTrackId && noisePlaying ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 计时器核心 */}
      <View style={styles.timerSection}>
        <ProgressRing
          progress={progress}
          size={280}
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
      <View style={styles.controls}>
        {!hasStarted && !state.isPaused && (
          <TouchableOpacity
            onPress={start}
            style={styles.mainBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.mainBtnText}>开始专注</Text>
          </TouchableOpacity>
        )}
        {state.isRunning && (
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={pause} style={styles.ctrlBtn} activeOpacity={0.7}>
              <Ionicons name="pause" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={skip} style={styles.skipBtn} activeOpacity={0.7}>
              <Text style={styles.skipBtnText}>跳过</Text>
            </TouchableOpacity>
          </View>
        )}
        {state.isPaused && (
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={resume} style={styles.mainBtn} activeOpacity={0.8}>
              <Text style={styles.mainBtnText}>继续</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={skip} style={styles.skipBtn} activeOpacity={0.7}>
              <Text style={styles.skipBtnText}>结束</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 会话类型快捷切换 */}
      <View style={styles.sessionTypes}>
        {(['focus', 'shortBreak', 'longBreak'] as const).map((type) => {
          const config = {
            focus: { emoji: '🍅', label: '专注', color: colors.primary },
            shortBreak: { emoji: '☕', label: '短休', color: colors.info },
            longBreak: { emoji: '🌿', label: '长休', color: colors.success },
          }[type];
          const isActive = state.sessionType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => switchType(type)}
              disabled={state.isRunning}
              style={[
                styles.typeBtn,
                isActive && { borderColor: config.color, backgroundColor: config.color + '15' },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.typeEmoji}>{config.emoji}</Text>
              <Text style={[styles.typeLabel, isActive && { color: config.color }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 白噪音面板 */}
      {showNoisePanel && (
        <View style={styles.noisePanel}>
          <Text style={styles.noisePanelTitle}>白噪音</Text>
          <View style={styles.noiseRow}>
            {[...natureTracks, ...ambientTracks].map((track) => (
              <NoiseTrackCard
                key={track.id}
                track={track}
                isActive={activeTrackId === track.id}
                isPlaying={noisePlaying}
                onToggle={() => toggle(track.id)}
              />
            ))}
          </View>
        </View>
      )}

      {/* 底部署名 */}
      <Text style={styles.footer}>深呼吸，专注当下 🌱</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
  },
  exitText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noiseToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noiseToggleActive: {
    backgroundColor: colors.primaryBg,
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  mainBtn: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  mainBtnText: {
    ...typography.heading3,
    color: colors.textInverse,
  },
  ctrlBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.tabBarBorder,
  },
  skipBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
  },
  skipBtnText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sessionTypes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  typeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
    maxWidth: 110,
  },
  typeEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  typeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  noisePanel: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  noisePanelTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noiseRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footer: {
    textAlign: 'center',
    ...typography.caption,
    color: colors.textTertiary,
    paddingBottom: spacing.xxl,
  },
});
