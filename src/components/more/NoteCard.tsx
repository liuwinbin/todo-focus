// ============================================================
// NoteCard — 灵感笔记卡片
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  const preview = note.content.length > 80
    ? note.content.slice(0, 80) + '...'
    : note.content;

  const timeLabel = formatRelativeTime(note.updatedAt);

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
      <Card style={styles.card} padding={spacing.md}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title || '无标题'}
          </Text>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>

        {preview ? (
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        ) : null}

        {note.tags.length > 0 && (
          <View style={styles.tags}>
            {note.tags.slice(0, 4).map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {note.tags.length > 4 && (
              <Text style={styles.tagMore}>+{note.tags.length - 4}</Text>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return new Date(iso).toLocaleDateString('zh-CN');
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs + 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  preview: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primaryBg,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.primaryDark,
  },
  tagMore: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
