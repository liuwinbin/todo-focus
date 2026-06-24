// ============================================================
// TimeLogEntryCard — 单条时间日志记录卡片
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { TIME_LOG_CATEGORIES } from '../../types';
import type { TimeLogEntry } from '../../types';
import { formatTimeDisplay } from '../../utils/dates';

interface TimeLogEntryCardProps {
  entry: TimeLogEntry;
  onPress: () => void;
  onDelete: () => void;
}

export function TimeLogEntryCard({ entry, onPress, onDelete }: TimeLogEntryCardProps) {
  const catConfig = TIME_LOG_CATEGORIES[entry.category];
  const hours = Math.floor(entry.durationMinutes / 60);
  const mins = entry.durationMinutes % 60;
  const durationText = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;

  const startTime = new Date(entry.startedAt).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View style={[styles.categoryBar, { backgroundColor: catConfig.color }]} />
      <View style={styles.iconBox}>
        <Text style={styles.emoji}>{catConfig.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {catConfig.label} · {startTime}
          </Text>
          {entry.note && (
            <Text style={styles.noteText} numberOfLines={1}>📝 {entry.note}</Text>
          )}
        </View>
      </View>
      <View style={styles.duration}>
        <Text style={styles.durationText}>{durationText}</Text>
      </View>
      <TouchableOpacity onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  categoryBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  emoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metaRow: {
    gap: 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  noteText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  duration: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  durationText: {
    ...typography.badge,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deleteBtn: {
    padding: 2,
  },
});
