import { View } from 'react-native';

import type { AppIconName } from '@/constants/habit-icons';
import { spacing } from '@/theme';

import { Icon } from './icon';
import { Surface } from './surface';
import { ThemedText } from './themed-text';

type StatTileProps = {
  icon: AppIconName;
  label: string;
  value: string;
  color: string;
};

/** A single headline number with a label, laid out two per row. */
export function StatTile({ icon, label, value, color }: StatTileProps) {
  return (
    <Surface
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={{ flexGrow: 1, flexBasis: '40%', gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <Icon name={icon} size={15} color={color} />
        <ThemedText variant="footnote" tone="secondary" numberOfLines={1} style={{ flexShrink: 1 }}>
          {label}
        </ThemedText>
      </View>
      <ThemedText variant="stat" selectable>
        {value}
      </ThemedText>
    </Surface>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{children}</View>;
}
