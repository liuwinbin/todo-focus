// ============================================================
// 添加/编辑时间日志 Modal
// ============================================================
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TimeLogForm } from '../../src/components/tracker/TimeLogForm';
import { useTimeLog } from '../../src/hooks/useTimeLog';
import { colors, spacing, typography } from '../../src/constants/theme';
import type { TimeLogEntry } from '../../src/types';

export default function AddTimeEntryModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { entries, addEntry, updateEntry } = useTimeLog();

  const existingEntry = params.id ? entries.find((e) => e.id === params.id) : undefined;

  const handleSave = (data: Omit<TimeLogEntry, 'id' | 'createdAt'>) => {
    if (existingEntry) {
      updateEntry(existingEntry.id, data);
    } else {
      addEntry(data);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {existingEntry ? '编辑记录' : '记录时间'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <TimeLogForm
        initialData={existingEntry}
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
