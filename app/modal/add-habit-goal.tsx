// ============================================================
// 创建/编辑打卡目标 Modal（含 all_category 成就检查）
// ============================================================
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HabitGoalForm } from '../../src/components/habits/HabitGoalForm';
import { useHabitGoals } from '../../src/hooks/useHabitGoals';
import { useAchievementContext } from '../../src/context/AchievementContext';
import { colors, spacing, typography } from '../../src/constants/theme';
import type { HabitGoal } from '../../src/types';

export default function AddHabitGoalModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { goals, addGoal, updateGoal } = useHabitGoals();
  const { dispatch: achievementDispatch } = useAchievementContext();

  const existingGoal = params.id ? goals.find((g) => g.id === params.id) : undefined;

  const handleSave = (data: Omit<HabitGoal, 'id' | 'createdAt'>) => {
    if (existingGoal) {
      updateGoal(existingGoal.id, data);
    } else {
      addGoal(data);
    }

    // ---- 成就检查：全面发展（4 个分类全覆盖） ----
    // 合并保存后的目标列表计算已覆盖的分类数
    const allGoals = existingGoal
      ? goals.map((g) => (g.id === existingGoal.id ? { ...g, ...data } : g))
      : [...goals, { ...data, id: '', createdAt: '' } as HabitGoal];
    const categories = new Set(allGoals.map((g) => g.category));
    achievementDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { key: 'all_category', progress: categories.size },
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {existingGoal ? '编辑目标' : '新建打卡目标'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <HabitGoalForm
        initialData={existingGoal}
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabBarBorder,
  },
  topTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
});
