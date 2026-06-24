// ============================================================
// NoteEditor — 灵感笔记编辑器
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import type { Note } from '../../types';

interface NoteEditorProps {
  initialData?: Note;
  onSave: (data: { title: string; content: string; tags: string[] }) => void;
  onCancel: () => void;
}

export function NoteEditor({ initialData, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [tagText, setTagText] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);

  const handleAddTag = () => {
    const trimmed = tagText.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
      setTagText('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      tags,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 标题 */}
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="笔记标题..."
        placeholderTextColor={colors.textTertiary}
        maxLength={50}
      />

      {/* 内容 */}
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
        placeholder="记录你的灵感..."
        placeholderTextColor={colors.textTertiary}
        multiline
        textAlignVertical="top"
        maxLength={2000}
      />

      {/* 标签 */}
      <Text style={styles.label}>标签</Text>
      <View style={styles.tagRow}>
        <TextInput
          style={styles.tagInput}
          value={tagText}
          onChangeText={setTagText}
          placeholder="输入标签后按添加"
          placeholderTextColor={colors.textTertiary}
          maxLength={15}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        <Button title="添加" onPress={handleAddTag} variant="outline" size="sm" />
      </View>

      {tags.length > 0 && (
        <View style={styles.tagList}>
          {tags.map((tag, i) => (
            <Button
              key={i}
              title={`#${tag} ✕`}
              onPress={() => handleRemoveTag(tag)}
              variant="outline"
              size="sm"
              style={styles.tagChip}
              textStyle={styles.tagChipText}
            />
          ))}
        </View>
      )}

      {/* 操作 */}
      <View style={styles.actions}>
        <Button title="取消" onPress={onCancel} variant="ghost" size="md" />
        <Button
          title={initialData ? '更新' : '保存'}
          onPress={handleSave}
          variant="primary"
          size="md"
          disabled={!title.trim() && !content.trim()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  titleInput: {
    ...typography.heading2,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  contentInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
    minHeight: 160,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.tabBarBorder,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagChip: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderColor: colors.primaryLight,
  },
  tagChipText: {
    fontSize: 12,
    color: colors.primaryDark,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
