import { View } from 'react-native';

import { radius, useTheme } from '@/theme';

type ProgressBarProps = { progress: number; color: string; height?: number };

export function ProgressBar({ progress, color, height = 6 }: ProgressBarProps) {
  const { colors } = useTheme();
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={{ height, borderRadius: radius.full, backgroundColor: colors.heatmapEmpty, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height, borderRadius: radius.full, backgroundColor: color }} />
    </View>
  );
}
