import { Platform, type TextStyle } from 'react-native';

/** 4-point spacing scale. Use with `gap` for layout rhythm. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Screen edge padding used by every screen. */
export const screenPadding = spacing.lg;

export const radius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const shadows = {
  card: '0 1px 2px rgba(0, 0, 0, 0.04)',
  raised: '0 6px 16px rgba(0, 0, 0, 0.08)',
} as const;

export const motion = {
  fast: 150,
  base: 250,
  slow: 400,
} as const;

/** Rounded system face on iOS gives the soft, friendly look of the design. */
const rounded = Platform.select({ ios: 'ui-rounded', default: undefined });

export const typography = {
  display: { fontFamily: rounded, fontSize: 52, fontWeight: '600', letterSpacing: -1.5, fontVariant: ['tabular-nums'] },
  largeTitle: { fontFamily: rounded, fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontFamily: rounded, fontSize: 22, fontWeight: '600' },
  headline: { fontFamily: rounded, fontSize: 17, fontWeight: '600' },
  body: { fontSize: 17, fontWeight: '400' },
  callout: { fontSize: 16, fontWeight: '500' },
  subhead: { fontSize: 15, fontWeight: '400' },
  footnote: { fontSize: 13, fontWeight: '500' },
  caption: { fontSize: 11, fontWeight: '500' },
  stat: { fontFamily: rounded, fontSize: 28, fontWeight: '600', fontVariant: ['tabular-nums'] },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
