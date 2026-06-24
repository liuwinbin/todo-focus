// ============================================================
// 日程 Tab — 月历 + 当日 Item 列表（统一实体）
// ============================================================
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../src/constants/theme';
import { formatDate, formatMonthYear } from '../../src/utils/dates';
import { useItems } from '../../src/hooks/useItems';
import { MonthCalendar } from '../../src/components/schedule/MonthCalendar';
import { DayScheduleList } from '../../src/components/schedule/DayScheduleList';
import type { Item } from '../../src/types';

export default function ScheduleScreen() {
  const router = useRouter();
  const { items, getItemsForDate, deleteItem } = useItems();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const dayItems = getItemsForDate(selectedDate);

  // Filter: items with date (schedule-visible)
  const scheduledItems = items.filter((it) => it.date != null);

  const handleMonthChange = useCallback((year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleAddItem = useCallback(() => {
    router.push(`/modal/add-item?date=${selectedDate}`);
  }, [router, selectedDate]);

  const handleItemPress = useCallback(
    (item: Item) => {
      router.push(`/modal/item-detail?id=${item.id}`);
    },
    [router],
  );

  const handleItemDelete = useCallback(
    (item: Item) => {
      Alert.alert('删除', `确定删除「${item.title}」？`, [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => deleteItem(item.id),
        },
      ]);
    },
    [deleteItem],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>日程</Text>
            <Text style={styles.subtitle}>
              {scheduledItems.length > 0 ? `${scheduledItems.length} 个安排` : '规划你的一天'}
            </Text>
          </View>
        </View>

        <MonthCalendar
          events={scheduledItems}
          selectedDate={selectedDate}
          year={currentYear}
          month={currentMonth}
          onSelectDate={handleSelectDate}
          onMonthChange={handleMonthChange}
        />

        <DayScheduleList
          events={dayItems}
          date={selectedDate}
          onEventPress={handleItemPress}
          onEventDelete={handleItemDelete}
          onAddEvent={handleAddItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
  },
  title: { ...typography.heading1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
});
