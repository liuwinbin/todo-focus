// ============================================================
// WhiteNoisePlayer — 白噪音播放器面板
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoiseTrackCard } from './NoiseTrackCard';
import { Card } from '../ui/Card';
import { VolumeSlider } from '../ui/VolumeSlider';
import { useWhiteNoise } from '../../hooks/useWhiteNoise';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

const CATEGORY_LABELS: Record<string, string> = {
  nature: '自然',
  ambient: '氛围',
  melodic: '旋律',
};

export function WhiteNoisePlayer() {
  const { tracks, activeTrackId, isPlaying, volume, toggle, stop, changeVolume } = useWhiteNoise();
  const [expanded, setExpanded] = useState(false);

  const activeTrack = tracks.find((t) => t.id === activeTrackId);

  const natureTracks = tracks.filter((t) => t.category === 'nature');
  const ambientTracks = tracks.filter((t) => t.category === 'ambient');
  const melodicTracks = tracks.filter((t) => t.category === 'melodic');

  const renderTrackRow = (trackList: typeof tracks, category: string) => (
    <View key={category}>
      <Text style={styles.categoryLabel}>{CATEGORY_LABELS[category] ?? category}</Text>
      <View style={styles.trackRow}>
        {trackList.map((track) => (
          <NoiseTrackCard
            key={track.id}
            track={track}
            isActive={activeTrackId === track.id}
            isPlaying={isPlaying}
            onToggle={() => toggle(track.id)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Card style={styles.container} padding={0}>
      {/* 头部 */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="musical-notes" size={20} color={colors.primary} />
          <Text style={styles.headerTitle}>白噪音</Text>
          {activeTrack && isPlaying && (
            <View style={styles.nowPlaying}>
              <Text style={styles.nowPlayingText}>
                {activeTrack.emoji} {activeTrack.name}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {activeTrackId && (
            <TouchableOpacity onPress={stop} hitSlop={8} style={styles.stopBtn}>
              <Ionicons name="stop-circle-outline" size={22} color={colors.error} />
            </TouchableOpacity>
          )}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textTertiary}
          />
        </View>
      </TouchableOpacity>

      {/* 音量滑块（始终显示） */}
      {expanded && (
        <View style={styles.volumeRow}>
          <Ionicons name="volume-low" size={16} color={colors.textSecondary} />
          <VolumeSlider
            value={volume}
            onValueChange={changeVolume}
            width={200}
          />
          <Ionicons name="volume-high" size={16} color={colors.textSecondary} />
        </View>
      )}

      {/* 展开后的音轨列表 */}
      {expanded && (
        <View style={styles.trackList}>
          {renderTrackRow(natureTracks, 'nature')}
          {renderTrackRow(ambientTracks, 'ambient')}
          {renderTrackRow(melodicTracks, 'melodic')}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  headerTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  nowPlaying: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  nowPlayingText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stopBtn: {
    padding: 2,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  trackList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  trackRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
