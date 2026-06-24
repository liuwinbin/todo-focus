// ============================================================
// 任务模板 Modal
// ============================================================
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TaskTemplatePicker } from '../../src/components/tasks/TaskTemplatePicker';
import { colors } from '../../src/constants/theme';

export default function TaskTemplatesModal() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TaskTemplatePicker onClose={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
