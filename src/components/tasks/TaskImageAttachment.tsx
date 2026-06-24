// ============================================================
// TaskImageAttachment — 图片附件（拍照/相册）
// ============================================================
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface TaskImageAttachmentProps {
  imageUri?: string;
  onChange: (uri: string | undefined) => void;
}

export function TaskImageAttachment({ imageUri, onChange }: TaskImageAttachmentProps) {
  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请在设置中允许访问相册');
        return false;
      }
    }
    return true;
  };

  const handlePickImage = async () => {
    const ok = await requestPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要权限', '请在设置中允许访问相机');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  if (imageUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>📷 图片附件</Text>
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📷 图片附件</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handlePickImage} activeOpacity={0.7}>
          <Ionicons name="image-outline" size={22} color={colors.primary} />
          <Text style={styles.actionText}>相册</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleTakePhoto} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={22} color={colors.primary} />
          <Text style={styles.actionText}>拍照</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryBg,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  previewContainer: {
    marginHorizontal: spacing.md,
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
  },
});
