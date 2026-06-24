// ============================================================
// 主题选择 Modal
// ============================================================
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemePicker } from '../../src/components/more/ThemePicker';
import { Button } from '../../src/components/ui/Button';
import { useSettingsContext } from '../../src/context/SettingsContext';
import { colors, spacing, typography } from '../../src/constants/theme';
import type { ThemeId } from '../../src/types';

export default function ThemesModal() {
  const { settings, dispatch } = useSettingsContext();

  const handleSelect = (id: ThemeId) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { themeId: id } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>选择主题</Text>
        <Button title="完成" onPress={() => router.back()} variant="primary" size="sm" />
      </View>
      <View style={styles.content}>
        <ThemePicker selected={settings.themeId} onSelect={handleSelect} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.tabBarBorder,
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
  },
});
