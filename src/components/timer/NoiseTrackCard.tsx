// ============================================================
// NoiseTrackCard — 单个白噪音音轨卡片
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../../constants/theme';
import type { NoiseTrack } from '../../utils/sounds';

interface NoiseTrackCardProps {
  track: NoiseTrack;
  isActive: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}

export function NoiseTrackCard({ track, isActive, isPlaying, onToggle }: NoiseTrackCardProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.card, isActive && styles.cardActive]}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{track.emoji}</Text>
      </View>
      <Text style={[styles.name, isActive && styles.nameActive]} numberOfLines={1}>
        {track.name}
      </Text>
      {isActive && isPlaying && (
        <View style={styles.playingIndicator}>
          <Ionicons name="musical-notes" size={14} color={colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    minWidth: 80,
    flex: 1,
    maxWidth: 100,
    ...shadows.sm,
  },
  cardActive: {
    backgroundColor: colors.primaryBg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  playingIndicator: {
    marginTop: 2,
  },
});
