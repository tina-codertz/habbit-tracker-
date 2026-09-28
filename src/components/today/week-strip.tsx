import { View } from 'react-native';

import { formatPercent } from '@/components/habits/format';
import { ProgressRing } from '@/components/ui/progress-ring';
import { ThemedText } from '@/components/ui/themed-text';
import { withAlpha } from '@/lib/color';
import { formatWeekdayNarrow, type DateKey } from '@/lib/dates';
import { spacing, useTheme } from '@/theme';

export type WeekDay = {
  key: DateKey;
  date: Date;
  /** Overall progress for the day, or null for future days / before any habit existed. */
  ratio: number | null;
  isToday: boolean;
};

export function WeekStrip({ days }: { days: WeekDay[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((day) => (
        <View
          key={day.key}
          accessible
          accessibilityLabel={`${day.date.toLocaleDateString(undefined, { weekday: 'long' })}${
            day.ratio === null ? '' : `, ${formatPercent(day.ratio)}`
          }`}
          style={{ alignItems: 'center', gap: spacing.xs }}>
          <ThemedText
            variant="caption"
            tone={day.isToday ? 'onHero' : 'onHeroSecondary'}
            style={{ fontWeight: day.isToday ? '700' : '500' }}>
            {formatWeekdayNarrow(day.date)}
          </ThemedText>
          <ProgressRing
            size={34}
            strokeWidth={3.5}
            progress={day.ratio ?? 0}
            color={colors.onHero}
            trackColor={withAlpha(colors.onHero, day.ratio === null ? 0.06 : 0.14)}>
            <ThemedText
              variant="caption"
              tone={day.ratio === null ? 'onHeroSecondary' : 'onHero'}
              style={{ fontVariant: ['tabular-nums'] }}>
              {day.date.getDate()}
            </ThemedText>
          </ProgressRing>
        </View>
      ))}
    </View>
  );
}
