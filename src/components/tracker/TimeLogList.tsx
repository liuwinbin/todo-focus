// ============================================================
// TimeLogList — 时间日志列表
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TimeLogEntryCard } from './TimeLogEntryCard';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { EmptyState } from '../ui/EmptyState';
import { colors, spacing, typography } from '../../constants/theme';
import { formatDate } from '../../utils/dates';
import type { TimeLogEntry } from '../../types';

interface TimeLogListProps {
  entries: TimeLogEntry[];
  onEntryPress: (entry: TimeLogEntry) => void;
  onEntryDelete: (id: string) => void;
  limit?: number;
  showHeader?: boolean;
}

export function TimeLogList({
  entries,
  onEntryPress,
  onEntryDelete,
  limit,
  showHeader = true,
}: TimeLogListProps) {
  const displayed = limit ? entries.slice(0, limit) : entries;

  return (
    <View>
      {showHeader && (
        <SectionHeader
          title="最近记录"
          actionLabel={entries.length > 0 ? `共 ${entries.length} 条` : undefined}
        />
      )}
      {displayed.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="还没有时间记录"
          subtitle="开始记录你的时间足迹吧 ⏱️"
        />
      ) : (
        <View style={styles.list}>
          {displayed.map((entry) => (
            <TimeLogEntryCard
              key={entry.id}
              entry={entry}
              onPress={() => onEntryPress(entry)}
              onDelete={() => onEntryDelete(entry.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
