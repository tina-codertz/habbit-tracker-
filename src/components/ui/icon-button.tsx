import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import type { AppIconName } from '@/constants/habit-icons';
import { radius, useTheme } from '@/theme';

import { Icon } from './icon';

type IconButtonProps = {
  icon: AppIconName;
  accessibilityLabel: string;
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Circular icon-only button, used for header actions. */
export function IconButton({ icon, accessibilityLabel, onPress, size = 36, style }: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? colors.surfacePressed : colors.surface,
        },
        style,
      ]}>
      <Icon name={icon} size={size * 0.5} color={colors.text} weight="semibold" />
    </Pressable>
  );
}
