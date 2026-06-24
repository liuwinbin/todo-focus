// ============================================================
// DayScheduleList — 当日日程事件列表
// ============================================================
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SectionHeader } from '../ui/SectionHeader';
import { EmptyState } from '../ui/EmptyState';
import { ScheduleEventCard } from './ScheduleEventCard';
import { colors, spacing, typography } from '../../constants/theme';
import { formatFriendlyDate } from '../../utils/dates';
import type { ScheduleEvent } from '../../types';

interface DayScheduleListProps {
  events: ScheduleEvent[];
  date: string;
  onEventPress: (event: ScheduleEvent) => void;
  onEventDelete: (event: ScheduleEvent) => void;
  onAddEvent: () => void;
}

export function DayScheduleList({
  events,
  date,
  onEventPress,
  onEventDelete,
  onAddEvent,
}: DayScheduleListProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        title={formatFriendlyDate(date)}
        actionLabel="+ 添加"
        onAction={onAddEvent}
      />

      {events.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="当天没有安排"
          subtitle="点击右上角添加日程"
          actionLabel="添加日程"
          onAction={onAddEvent}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ScheduleEventCard
              event={item}
              onPress={() => onEventPress(item)}
              onDelete={() => onEventDelete(item)}
            />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
});
