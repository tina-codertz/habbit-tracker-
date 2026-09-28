import { View } from 'react-native';

import { formatPercent } from '@/components/habits/format';
import { Icon } from '@/components/ui/icon';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Surface } from '@/components/ui/surface';
import { ThemedText } from '@/components/ui/themed-text';
import { withAlpha } from '@/lib/color';
import { radius, spacing, useTheme } from '@/theme';

import { WeekStrip, type WeekDay } from './week-strip';

type HeroProgressCardProps = {
  progress: number;
  completed: number;
  total: number;
  week: WeekDay[];
};

/** Today's overall progress with the current week at a glance. */
export function HeroProgressCard({ progress, completed, total, week }: HeroProgressCardProps) {
  const { colors } = useTheme();
  return (
    <Surface variant="hero" padding="lg" style={{ gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <View style={{ flex: 1, gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: radius.full,
                backgroundColor: colors.heroChip,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="chart" size={16} color={colors.onHero} />
            </View>
            <ThemedText variant="headline" tone="onHero">
              Today’s progress
            </ThemedText>
          </View>
          <ThemedText variant="display" tone="onHero" selectable accessibilityLabel={`${formatPercent(progress)} complete`}>
            {formatPercent(progress)}
          </ThemedText>
        </View>

        <ProgressRing
          size={112}
          strokeWidth={12}
          progress={progress}
          color={colors.onHero}
          trackColor={withAlpha(colors.onHero, 0.12)}>
          <View style={{ alignItems: 'center' }}>
            <ThemedText variant="title" tone="onHero" style={{ fontVariant: ['tabular-nums'] }}>
              {completed}/{total}
            </ThemedText>
            <ThemedText variant="caption" tone="onHeroSecondary">
              habits
            </ThemedText>
          </View>
        </ProgressRing>
      </View>

      <WeekStrip days={week} />
    </Surface>
  );
}
