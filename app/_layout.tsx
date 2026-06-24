// ============================================================
// 根布局 — 包裹 AppProvider + Stack 导航（含主题 StatusBar）
// ============================================================
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppProvider';
import { useSettingsContext } from '../src/context/SettingsContext';

function ThemedStatusBar() {
  const { settings } = useSettingsContext();
  return <StatusBar style={settings.themeId === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemedStatusBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal/add-item"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/item-detail"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/session-complete"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/task-templates"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/focus-stats"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/focus-room"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/add-habit-goal"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/habit-detail"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/badges"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/add-time-entry"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/themes"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/add-countdown"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="modal/add-note"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </AppProvider>
  );
}
