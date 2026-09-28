/**
 * App palette as explicit light/dark pairs.
 *
 * Every value is a plain hex string (not a PlatformColor) so it can be mixed
 * for heatmap shades and passed to SVG / Reanimated safely. Read it through
 * `useTheme()` so components re-render when the scheme flips.
 */
export const palette = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F7',
    surfaceRaised: '#FFFFFF',
    surfacePressed: '#ECECF0',
    text: '#141416',
    textSecondary: '#6E6E76',
    textTertiary: '#A3A3AB',
    separator: '#E6E6EB',
    tint: '#9B5CC4',
    onTint: '#FFFFFF',
    hero: '#EDCDF8',
    onHero: '#1C1224',
    onHeroSecondary: '#5E4A6B',
    heroChip: '#FFFFFF',
    heatmapEmpty: '#EAEAEF',
    positive: '#3DBE72',
    danger: '#E5484D',
  },
  dark: {
    background: '#0B0B0D',
    surface: '#18181B',
    surfaceRaised: '#222226',
    surfacePressed: '#2A2A2F',
    text: '#F4F4F6',
    textSecondary: '#A1A1AA',
    textTertiary: '#6B6B74',
    separator: '#2A2A30',
    tint: '#D2A8F2',
    onTint: '#1C1224',
    hero: '#33243F',
    onHero: '#F6ECFC',
    onHeroSecondary: '#C7B3D6',
    heroChip: '#46345466',
    heatmapEmpty: '#232328',
    positive: '#4FD18A',
    danger: '#FF6369',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type ThemeColors = { [K in keyof (typeof palette)['light']]: string };

/** Accent colors a user can assign to a habit. Tuned to read well in both schemes. */
export const habitColors = {
  lilac: { light: '#B57EDC', dark: '#C99AF2' },
  mint: { light: '#3DBE72', dark: '#4FD18A' },
  peach: { light: '#FF9460', dark: '#FFA476' },
  sky: { light: '#4DA3F0', dark: '#65B3F5' },
  lemon: { light: '#F2B924', dark: '#F5C84A' },
  rose: { light: '#EE6A8E', dark: '#F4819F' },
  teal: { light: '#2FB5B2', dark: '#45C8C4' },
  slate: { light: '#7C7C8C', dark: '#9C9CAB' },
} as const;

export type HabitColorName = keyof typeof habitColors;
export const habitColorNames = Object.keys(habitColors) as HabitColorName[];
