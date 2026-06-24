// ============================================================
// 成就徽章收藏册 Modal
// ============================================================
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AchievementList } from '../../src/components/habits/AchievementList';
import { AchievementUnlockOverlay } from '../../src/components/habits/AchievementUnlockOverlay';
import { useAchievements } from '../../src/hooks/useAchievements';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function BadgesModal() {
  const router = useRouter();
  const {
    achievementsByCategory,
    totalUnlocked,
    totalCount,
    latestUnlock,
    clearLatest,
  } = useAchievements();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>成就徽章</Text>
        <View style={{ width: 24 }} />
      </View>

      <AchievementList
        achievementsByCategory={achievementsByCategory}
        totalUnlocked={totalUnlocked}
        totalCount={totalCount}
      />

      {/* 解锁庆祝弹窗 */}
      <AchievementUnlockOverlay
        achievement={latestUnlock}
        onDismiss={clearLatest}
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
