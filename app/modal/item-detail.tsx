// ============================================================
// Item 详情/编辑 Modal
// ============================================================
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ItemForm } from '../../src/components/items/ItemForm';
import type { ItemFormData } from '../../src/components/items/ItemForm';
import { useItems } from '../../src/hooks/useItems';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function ItemDetailModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateItem, deleteItem } = useItems();

  const item = items.find((it) => it.id === id);

  const handleSave = (data: ItemFormData) => {
    if (item) {
      const subtaskObjects = data.subtasks.map((title) => ({ id: '', title, completed: false }));
      updateItem(item.id, { ...data, subtasks: subtaskObjects });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!item) return;
    Alert.alert('删除', `确定删除「${item.title}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => { deleteItem(item.id); router.back(); } },
    ]);
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>未找到项目</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>编辑项目</Text>
        <TouchableOpacity onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      <ItemForm
        onSave={handleSave}
        onCancel={() => router.back()}
        initialData={{ ...item, subtasks: item.subtasks.map((s) => s.title) }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.tabBarBorder },
  topTitle: { ...typography.heading3, color: colors.textPrimary },
});
