import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import type { AppIconName } from '@/constants/habit-icons';
import { withAlpha } from '@/lib/color';
import { radius, spacing, useTheme } from '@/theme';

import { Icon } from './icon';
import { ThemedText } from './themed-text';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'md' | 'lg';
  icon?: AppIconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const palette = {
    primary: { background: colors.text, foreground: colors.background },
    secondary: { background: colors.surface, foreground: colors.text },
    destructive: { background: withAlpha(colors.danger, 0.12), foreground: colors.danger },
  }[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: size === 'lg' ? 56 : 48,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.full,
          backgroundColor: palette.background,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.foreground} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {icon && <Icon name={icon} size={18} color={palette.foreground} weight="semibold" />}
          <ThemedText variant="headline" style={{ color: palette.foreground }}>
            {title}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}
