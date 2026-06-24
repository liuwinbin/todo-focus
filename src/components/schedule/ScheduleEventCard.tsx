// ============================================================
// ScheduleEventCard — 日程事件卡片
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { PillBadge } from '../ui/PillBadge';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { EVENT_COLORS, type ScheduleEvent } from '../../types';
import { useItemContext } from '../../context/ItemContext';

interface ScheduleEventCardProps {
  event: ScheduleEvent;
  onPress: () => void;
  onDelete: () => void;
}

export function ScheduleEventCard({ event, onPress, onDelete }: ScheduleEventCardProps) {
  const { state: itemState } = useItemContext();
  const linkedTask = event.taskId
    ? itemState.items.find((t) => t.id === event.taskId)
    : undefined;

  const accentColor = event.color ? EVENT_COLORS[event.color] : '#A4C8E8';
  const timeLabel = event.allDay
    ? '全天'
    : `${event.startTime || ''} - ${event.endTime || ''}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card} padding={0}>
        <View style={styles.row}>
          {/* 左侧色条 */}
          <View style={[styles.colorBar, { backgroundColor: accentColor }]} />

          {/* 内容区 */}
          <View style={styles.content}>
            <View style={styles.topRow}>
              {timeLabel ? (
                <Text style={styles.timeLabel}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  {' '}{timeLabel}
                </Text>
              ) : null}
              {linkedTask && (
                <PillBadge
                  label="关联任务"
                  color={colors.primary}
                  backgroundColor={colors.primaryBg}
                  size="sm"
                />
              )}
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>

            {linkedTask && (
              <Text style={styles.taskRef} numberOfLines={1}>
                📋 {linkedTask.title}
              </Text>
            )}

            {event.notes && (
              <Text style={styles.notes} numberOfLines={1}>
                {event.notes}
              </Text>
            )}
          </View>

          {/* 删除按钮 */}
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
            <Ionicons name="close-outline" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  colorBar: {
    width: 4,
    borderRadius: borderRadius.lg,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    paddingLeft: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  taskRef: {
    ...typography.caption,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  notes: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  deleteBtn: {
    padding: spacing.md,
    justifyContent: 'center',
  },
});
