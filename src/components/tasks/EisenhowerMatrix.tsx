// ============================================================
// EisenhowerMatrix — 四象限视图（2×2 紧急/重要矩阵）
// ============================================================
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { QuadrantCell } from './QuadrantCell';
import { colors, spacing } from '../../constants/theme';
import type { Task, Priority } from '../../types';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onAddItem?: (context: { priority: Priority; urgent: boolean }) => void;
}

export function EisenhowerMatrix({
  tasks,
  onTaskPress,
  onToggleComplete,
  onAddItem,
}: EisenhowerMatrixProps) {
  // 四象限分类逻辑：高优先=重要，低/中优先=不重要；有截止日期且临近=紧急
  const quadrants = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const isUrgent = (t: Task) => {
      if (!t.date) return false;
      return t.date <= today;
    };

    const urgentImportant: Task[] = [];
    const notUrgentImportant: Task[] = [];
    const urgentNotImportant: Task[] = [];
    const notUrgentNotImportant: Task[] = [];

    for (const t of tasks) {
      if (t.completed) continue;
      const important = t.priority === 'high';
      const urgent = isUrgent(t);

      if (important && urgent) urgentImportant.push(t);
      else if (important && !urgent) notUrgentImportant.push(t);
      else if (!important && urgent) urgentNotImportant.push(t);
      else notUrgentNotImportant.push(t);
    }

    return { urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant };
  }, [tasks]);

  return (
    <View style={styles.container}>
      {/* 行 1: 重要 */}
      <View style={styles.row}>
        <QuadrantCell
          title="重要 & 紧急"
          subtitle="立即去做"
          color={colors.quadrantUrgentImportant}
          tasks={quadrants.urgentImportant}
          onTaskPress={onTaskPress}
          onToggleComplete={onToggleComplete}
          onAddItem={onAddItem ? () => onAddItem({ priority: 'high', urgent: true }) : undefined}
        />
        <QuadrantCell
          title="重要 & 不紧急"
          subtitle="计划安排"
          color={colors.quadrantNotUrgentImportant}
          tasks={quadrants.notUrgentImportant}
          onTaskPress={onTaskPress}
          onToggleComplete={onToggleComplete}
          onAddItem={onAddItem ? () => onAddItem({ priority: 'high', urgent: false }) : undefined}
        />
      </View>
      {/* 行 2: 不重要 */}
      <View style={styles.row}>
        <QuadrantCell
          title="不重要 & 紧急"
          subtitle="授权他人"
          color={colors.quadrantUrgentNotImportant}
          tasks={quadrants.urgentNotImportant}
          onTaskPress={onTaskPress}
          onToggleComplete={onToggleComplete}
          onAddItem={onAddItem ? () => onAddItem({ priority: 'low', urgent: true }) : undefined}
        />
        <QuadrantCell
          title="不重要 & 不紧急"
          subtitle="减少/删除"
          color={colors.quadrantNotUrgentNotImportant}
          tasks={quadrants.notUrgentNotImportant}
          onTaskPress={onTaskPress}
          onToggleComplete={onToggleComplete}
          onAddItem={onAddItem ? () => onAddItem({ priority: 'low', urgent: false }) : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
