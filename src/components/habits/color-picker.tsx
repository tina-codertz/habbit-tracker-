import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { habitColorNames, habitColors, radius, spacing, useTheme, type HabitColorName } from '@/theme';

type ColorPickerProps = { value: HabitColorName; onChange: (color: HabitColorName) => void };

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { scheme, colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {habitColorNames.map((name) => {
        const selected = name === value;
        const swatch = habitColors[name][scheme];
        return (
          <Pressable
            key={name}
            accessibilityRole="radio"
            accessibilityLabel={name}
            accessibilityState={{ selected }}
            onPress={() => onChange(name)}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: radius.full,
              backgroundColor: swatch,
              alignItems: 'center',
              justifyContent: 'center',
              // Ring separated from the swatch by a background-colored gap.
              boxShadow: selected ? `0 0 0 3px ${colors.background}, 0 0 0 5px ${swatch}` : undefined,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}>
            {selected && <Icon name="check" size={18} color="#FFFFFF" weight="bold" />}
          </Pressable>
        );
      })}
    </View>
  );
}
