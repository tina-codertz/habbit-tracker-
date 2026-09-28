import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

const paddings = { none: 0, sm: spacing.md, md: spacing.lg, lg: spacing.xl } as const;

export type SurfaceProps = ViewProps & {
  variant?: 'default' | 'hero';
  padding?: keyof typeof paddings;
  style?: StyleProp<ViewStyle>;
};

/** Rounded tile that groups related content, matching the soft-card look of the design. */
export function Surface({ variant = 'default', padding = 'md', style, ...props }: SurfaceProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: variant === 'hero' ? colors.hero : colors.surface,
          borderRadius: variant === 'hero' ? radius.xl : radius.lg,
          borderCurve: 'continuous',
          padding: paddings[padding],
        },
        style,
      ]}
      {...props}
    />
  );
}
