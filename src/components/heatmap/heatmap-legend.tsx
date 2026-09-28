import { View } from 'react-native';

import { ThemedText } from '@/components/ui/themed-text';
import { heatmapShades } from '@/lib/color';
import { radius, spacing, useTheme } from '@/theme';

export function HeatmapLegend({ color }: { color: string }) {
  const { colors } = useTheme();
  const shades = heatmapShades(colors.heatmapEmpty, color);
  return (
    <View
      accessible
      accessibilityLabel="Darker squares mean more of the goal was completed"
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-end' }}>
      <ThemedText variant="caption" tone="tertiary">
        Less
      </ThemedText>
      {shades.map((shade) => (
        <View key={shade} style={{ width: 10, height: 10, borderRadius: radius.xs / 1.5, backgroundColor: shade }} />
      ))}
      <ThemedText variant="caption" tone="tertiary">
        More
      </ThemedText>
    </View>
  );
}
