// ============================================================
// 统一新建 Item Modal（支持 task + schedule 字段）
// ============================================================
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ItemForm } from '../../src/components/items/ItemForm';
import type { ItemFormData } from '../../src/components/items/ItemForm';
import { useItems } from '../../src/hooks/useItems';
import type { Priority } from '../../src/types';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function AddItemModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; priority?: string }>();
  const { addItem } = useItems();

  const initialPriority = (params.priority === 'high' || params.priority === 'medium' || params.priority === 'low')
    ? params.priority as Priority
    : undefined;

  const handleSave = (data: ItemFormData) => {
    addItem(data);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>新建项目</Text>
        <View style={{ width: 24 }} />
      </View>
      <ItemForm onSave={handleSave} onCancel={() => router.back()} defaultDate={params.date} initialData={initialPriority ? { priority: initialPriority } : undefined} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.tabBarBorder },
  topTitle: { ...typography.heading3, color: colors.textPrimary },
});
