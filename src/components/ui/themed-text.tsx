import { Text, type TextProps } from 'react-native';

import { typography, useTheme, type ThemeColors, type TypographyVariant } from '@/theme';

const tones = {
  primary: 'text',
  secondary: 'textSecondary',
  tertiary: 'textTertiary',
  tint: 'tint',
  onTint: 'onTint',
  onHero: 'onHero',
  onHeroSecondary: 'onHeroSecondary',
  danger: 'danger',
  positive: 'positive',
} as const satisfies Record<string, keyof ThemeColors>;

export type TextTone = keyof typeof tones;

export type ThemedTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
};

/** The only place font sizes and text colors are applied. */
export function ThemedText({ variant = 'body', tone = 'primary', style, ...props }: ThemedTextProps) {
  const { colors } = useTheme();
  return <Text style={[typography[variant], { color: colors[tones[tone]] }, style]} {...props} />;
}
