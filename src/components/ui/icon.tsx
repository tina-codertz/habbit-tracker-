import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { appIcons, habitIcons, type AppIconName, type HabitIconName } from '@/constants/habit-icons';

type IconProps = {
  name: AppIconName | HabitIconName;
  size?: number;
  color: ColorValue;
  weight?: SymbolViewProps['weight'];
  style?: StyleProp<ViewStyle>;
};

/** Cross-platform icon: SF Symbols on iOS, Material Symbols on Android and web. */
export function Icon({ name, size = 20, color, weight, style }: IconProps) {
  const symbol = name in appIcons ? appIcons[name as AppIconName] : habitIcons[name as HabitIconName];
  return (
    <SymbolView
      name={{ ios: symbol.ios, android: symbol.android, web: symbol.web }}
      size={size}
      tintColor={color}
      weight={weight}
      style={style}
    />
  );
}
