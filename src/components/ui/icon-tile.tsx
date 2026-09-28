import { View } from 'react-native';

import type { AppIconName, HabitIconName } from '@/constants/habit-icons';
import { withAlpha } from '@/lib/color';
import { radius, useTheme } from '@/theme';

import { Icon } from './icon';

const sizes = { sm: 32, md: 44, lg: 64 } as const;

type IconTileProps = {
  icon: AppIconName | HabitIconName;
  color: string;
  size?: keyof typeof sizes;
  /** Solid fills the tile with the color; soft uses a translucent wash. */
  variant?: 'soft' | 'solid';
};

/** Squircle with an icon on a tinted background — the visual identity of a habit. */
export function IconTile({ icon, color, size = 'md', variant = 'soft' }: IconTileProps) {
  const { scheme } = useTheme();
  const dimension = sizes[size];
  const solid = variant === 'solid';
  return (
    <View
      style={{
        width: dimension,
        height: dimension,
        borderRadius: size === 'sm' ? radius.sm : radius.md,
        borderCurve: 'continuous',
        backgroundColor: solid ? color : withAlpha(color, scheme === 'dark' ? 0.22 : 0.16),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={icon} size={dimension * 0.48} color={solid ? '#FFFFFF' : color} />
    </View>
  );
}
