// ============================================================
// 视图页 — 列表/日/周/四象限（统一 Item 实体）
// ============================================================
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TaskCard } from '../../src/components/tasks/TaskCard';
import { TaskViewSelector } from '../../src/components/tasks/TaskViewSelector';
import { DayTaskView } from '../../src/components/tasks/DayTaskView';
import { WeekTaskView } from '../../src/components/tasks/WeekTaskView';
import { EisenhowerMatrix } from '../../src/components/tasks/EisenhowerMatrix';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Button } from '../../src/components/ui/Button';
import { colors, spacing, typography } from '../../src/constants/theme';
import { formatDate } from '../../src/utils/dates';
import { useItems } from '../../src/hooks/useItems';
import type { ItemView, Item, Priority } from '../../src/types';

export default function ViewsScreen() {
  const { items, toggleComplete, deleteItem, toggleSubtask, deleteSubtask } = useItems();
  const router = useRouter();

  const [view, setView] = useState<ItemView>('list');
  const [selectedDate] = useState(formatDate(new Date()));

  const pendingItems = items.filter((it) => !it.completed);
  const completedItems = items.filter((it) => it.completed);

  const handleItemPress = (item: Item) => {
    router.push(`/modal/item-detail?id=${item.id}`);
  };

  // ====== 列表视图 ======
  const renderListView = () => (
    <FlatList
      data={[...pendingItems, ...completedItems]}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => (
        <TaskCard
          task={item}
          onToggleComplete={() => toggleComplete(item.id)}
          onDelete={() => deleteItem(item.id)}
          onToggleSubtask={(subId) => toggleSubtask(item.id, subId)}
          onDeleteSubtask={(subId) => deleteSubtask(item.id, subId)}
          onPress={() => handleItemPress(item)}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );

  // ====== 视图渲染 ======
  const renderView = () => {
    switch (view) {
      case 'list':
        return items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="leaf-outline"
              title="还没有项目"
              subtitle="点击下方按钮创建任务或日程 ✨"
              actionLabel="新建项目"
              onAction={() => router.push('/modal/add-item')}
            />
          </View>
        ) : (
          renderListView()
        );
      case 'day':
        return (
          <DayTaskView
            tasks={items}
            selectedDate={selectedDate}
            onTaskPress={handleItemPress}
            onToggleComplete={toggleComplete}
            onAddItem={() => router.push(`/modal/add-item?date=${selectedDate}`)}
          />
        );
      case 'week':
        return (
          <WeekTaskView
            tasks={items}
            onTaskPress={handleItemPress}
            onToggleComplete={toggleComplete}
            onAddItem={(day: string) => router.push(`/modal/add-item?date=${day}`)}
          />
        );
      case 'quadrant':
        return (
          <EisenhowerMatrix
            tasks={items}
            onTaskPress={handleItemPress}
            onToggleComplete={toggleComplete}
            onAddItem={({ priority, urgent }: { priority: Priority; urgent: boolean }) => {
              const today = formatDate(new Date());
              const params = [`priority=${priority}`];
              if (urgent) params.push(`date=${today}`);
              router.push(`/modal/add-item?${params.join('&')}`);
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>视图</Text>
            <Text style={styles.subtitle}>
              {pendingItems.length} 个待完成
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Button
              title="+ 新建"
              onPress={() => router.push('/modal/add-item')}
              variant="primary"
              size="sm"
            />
          </View>
        </View>
        <View style={styles.viewSelector}>
          <TaskViewSelector value={view} onChange={setView} />
        </View>
      </View>
      {renderView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { ...typography.heading1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  viewSelector: {},
  emptyContainer: { flex: 1, justifyContent: 'center' },
  list: { paddingTop: spacing.sm, paddingBottom: spacing.xxl },
});
