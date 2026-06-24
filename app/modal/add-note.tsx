// ============================================================
// 添加 / 编辑灵感笔记 Modal
// ============================================================
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NoteEditor } from '../../src/components/more/NoteEditor';
import { useNotes } from '../../src/hooks/useNotes';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function AddNoteModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { notes, addNote, updateNote, deleteNote } = useNotes();

  const existing = id ? notes.find((n) => n.id === id) : undefined;

  const handleSave = (data: { title: string; content: string; tags: string[] }) => {
    if (existing) {
      updateNote(existing.id, data);
    } else {
      addNote(data);
    }
    router.back();
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert('删除笔记', `确定要删除「${existing.title || '无标题'}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          deleteNote(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{existing ? '编辑笔记' : '新建笔记'}</Text>
      </View>
      <NoteEditor
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
            删除此笔记
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
