import type { ComponentProps } from 'react';
import type { Stack } from 'expo-router';

import { useTheme } from '@/theme';

type StackOptions = NonNullable<ComponentProps<typeof Stack>['screenOptions']>;

const isIOS = process.env.EXPO_OS === 'ios';

/** Shared header styling so every stack in the app looks the same. */
export function useStackOptions(): StackOptions {
  const { colors } = useTheme();
  return {
    // A transparent header lets content scroll beneath the iOS large title / liquid glass bar.
    headerTransparent: isIOS,
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    headerLargeStyle: { backgroundColor: 'transparent' },
    headerStyle: isIOS ? undefined : { backgroundColor: colors.background },
    headerTitleStyle: { color: colors.text },
    headerLargeTitleStyle: { color: colors.text },
    headerTintColor: colors.tint,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: colors.background },
  };
}
