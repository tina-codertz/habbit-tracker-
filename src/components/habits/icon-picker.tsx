import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { habitIconNames, habitIcons, type HabitIconName } from '@/constants/habit-icons';
import { withAlpha } from '@/lib/color';
import { radius, spacing, useTheme } from '@/theme';

type IconPickerProps = { value: HabitIconName; color: string; onChange: (icon: HabitIconName) => void };

export function IconPicker({ value, color, onChange }: IconPickerProps) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {habitIconNames.map((name) => {
        const selected = name === value;
        return (
          <Pressable
            key={name}
            accessibilityRole="radio"
            accessibilityLabel={habitIcons[name].label}
            accessibilityState={{ selected }}
            onPress={() => onChange(name)}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: radius.md,
              borderCurve: 'continuous',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? withAlpha(color, 0.18) : pressed ? colors.surfacePressed : colors.surface,
              borderWidth: 1.5,
              borderColor: selected ? color : 'transparent',
            })}>
            <Icon name={name} size={22} color={selected ? color : colors.textSecondary} />
          </Pressable>
        );
      })}
    </View>
  );
}
