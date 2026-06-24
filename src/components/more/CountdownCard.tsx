// ============================================================
// CountdownCard — 倒数日卡片
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { CountdownItem } from '../../types';

interface CountdownCardProps {
  item: CountdownItem & { daysRemaining: number };
  onPress?: () => void;
  onLongPress?: () => void;
}

export function CountdownCard({ item, onPress, onLongPress }: CountdownCardProps) {
  const { daysRemaining } = item;
  const isToday = daysRemaining === 0;
  const isOverdue = daysRemaining < 0;

  const statusLabel = isToday
    ? '今天'
    : isOverdue
      ? `${Math.abs(daysRemaining)}天前`
      : `${daysRemaining}天`;

  const statusColor = isToday
    ? colors.accent
    : isOverdue
      ? colors.textTertiary
      : colors.primary;

  const progressLabel = isToday
    ? '🎉 就是今天！'
    : isOverdue
      ? '已结束'
      : `还有 ${daysRemaining} 天`;

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
      <Card style={styles.card} padding={spacing.md}>
        <View style={styles.left}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.note} numberOfLines={1}>
            {item.note || progressLabel}
          </Text>
        </View>
        <View style={[styles.right, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.days, { color: statusColor }]}>{statusLabel}</Text>
          <Text style={[styles.daysLabel, { color: statusColor }]}>
            {isToday ? 'TODAY' : isOverdue ? 'PASSED' : 'DAYS'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  left: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  center: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  note: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  right: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 56,
  },
  days: {
    fontSize: 20,
    fontWeight: '800',
  },
  daysLabel: {
    ...typography.badge,
    fontSize: 9,
    letterSpacing: 1,
  },
});
