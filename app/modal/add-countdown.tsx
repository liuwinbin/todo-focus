// ============================================================
// 添加 / 编辑倒数日 Modal（含通知调度）
// ============================================================
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountdownForm } from '../../src/components/more/CountdownForm';
import { useCountdowns } from '../../src/hooks/useCountdowns';
import { scheduleCountdownReminder } from '../../src/utils/notifications';
import { colors, spacing, typography } from '../../src/constants/theme';
import type { CountdownItem } from '../../src/types';

export default function AddCountdownModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { countdowns, addCountdown, updateCountdown, deleteCountdown } = useCountdowns();

  const existing = id ? countdowns.find((c) => c.id === id) : undefined;

  const handleSave = (data: Omit<CountdownItem, 'id' | 'createdAt'>) => {
    const item: CountdownItem = {
      ...data,
      id: existing?.id ?? '',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    if (existing) {
      updateCountdown(existing.id, data);
    } else {
      addCountdown(data);
    }

    // 调度倒数日提醒通知
    scheduleCountdownReminder(item).catch(() => {});

    router.back();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('删除倒数日', `确定要删除「${existing.title}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteCountdown(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{existing ? '编辑倒数日' : '添加倒数日'}</Text>
      </View>
      <CountdownForm
        initialData={existing}
        onSave={handleSave}
        onCancel={() => router.back()}
      />
      {existing && (
        <View style={styles.deleteRow}>
          <Text
            style={styles.deleteText}
            onPress={handleDelete}
          >
            删除此倒数日
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabBarBorder,
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  deleteRow: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    marginHorizontal: spacing.md,
  },
  deleteText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },
});
