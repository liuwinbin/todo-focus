// ============================================================
// SessionHistoryList — 专注会话历史列表
// ============================================================
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { FocusSession } from '../../types';

interface SessionHistoryListProps {
  sessions: FocusSession[];
  limit?: number;
}

const SESSION_TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  focus: { emoji: '🍅', label: '专注', color: colors.primary },
  shortBreak: { emoji: '☕', label: '短休息', color: colors.info },
  longBreak: { emoji: '🌿', label: '长休息', color: colors.success },
};

function SessionItem({ session }: { session: FocusSession }) {
  const config = SESSION_TYPE_CONFIG[session.type] ?? SESSION_TYPE_CONFIG.focus;
  const minutes = Math.round(session.actualDuration / 60);
  const time = new Date(session.startedAt).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const plannedMin = Math.round(session.plannedDuration / 60);

  return (
    <View style={styles.item}>
      <View style={[styles.dot, { backgroundColor: config.color + '30' }]}>
        <Text style={styles.dotEmoji}>{config.emoji}</Text>
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.itemTop}>
          <Text style={styles.itemType}>{config.label}</Text>
          {session.completed ? (
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          ) : (
            <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
          )}
        </View>
        <Text style={styles.itemMeta}>
          {time} · {minutes}/{plannedMin} 分钟
        </Text>
      </View>
    </View>
  );
}

export function SessionHistoryList({ sessions, limit }: SessionHistoryListProps) {
  const displayed = useMemo(
    () => (limit ? sessions.slice(0, limit) : sessions),
    [sessions, limit],
  );

  if (displayed.length === 0) {
    return (
      <Card style={styles.container}>
        <Text style={styles.title}>最近记录</Text>
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={32} color={colors.textTertiary} />
          <Text style={styles.emptyText}>暂无专注记录</Text>
          <Text style={styles.emptySubtext}>完成第一个番茄钟吧 🍅</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container} padding={0}>
      <View style={styles.header}>
        <Text style={styles.title}>最近记录</Text>
        <Text style={styles.count}>共 {sessions.length} 次</Text>
      </View>
      {displayed.map((session) => (
        <SessionItem key={session.id} session={session} />
      ))}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  count: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.tabBarBorder,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotEmoji: {
    fontSize: 18,
  },
  itemInfo: {
    flex: 1,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemType: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
