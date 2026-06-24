// ============================================================
// Tab 导航布局 — 4 个底部 Tab（动态主题色）
// ============================================================
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../src/hooks/useThemeColors';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '专注',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'timer-outline' as IoniconName} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '日程',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'calendar-outline' as IoniconName} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="views"
        options={{
          title: '视图',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'layers-outline' as IoniconName} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: '更多',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={'apps-outline' as IoniconName} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
