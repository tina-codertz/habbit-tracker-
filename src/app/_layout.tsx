import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { DatabaseProvider } from '@/db/database-provider';
import { useStackOptions } from '@/hooks/use-stack-options';
import { configureNotifications } from '@/lib/notifications';
import { applyStoredThemePreference } from '@/lib/theme-preference';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();
applyStoredThemePreference();
configureNotifications();

function HideSplashWhenReady() {
  // Rendered inside the database provider, so it mounts only once the database is open.
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return null;
}

export default function RootLayout() {
  const { scheme, colors } = useTheme();
  const stackOptions = useStackOptions();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.tint,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.separator,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <DatabaseProvider>
        <HideSplashWhenReady />
        <Stack screenOptions={stackOptions}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="habit/[id]/index" options={{ title: '' }} />
          <Stack.Screen
            name="habit/new"
            options={{ presentation: 'modal', title: 'New habit', headerTransparent: false }}
          />
          <Stack.Screen
            name="habit/[id]/edit"
            options={{ presentation: 'modal', title: 'Edit habit', headerTransparent: false }}
          />
        </Stack>
      </DatabaseProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
