import { useColorScheme } from 'react-native';

import { habitColors, palette, type ColorScheme, type HabitColorName, type ThemeColors } from './colors';

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: palette[scheme] };
}

/** Resolves a habit's accent color for the active scheme. */
export function useHabitColor(name: HabitColorName): string {
  const { scheme } = useTheme();
  return (habitColors[name] ?? habitColors.lilac)[scheme];
}
