import { Link, Stack } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { formatPercent, formatStreak } from '@/components/habits/format';
import { HeatmapLegend } from '@/components/heatmap/heatmap-legend';
import { YearHeatmap } from '@/components/heatmap/year-heatmap';
import { EmptyState } from '@/components/ui/empty-state';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionHeader } from '@/components/ui/section-header';
import { StatGrid, StatTile } from '@/components/ui/stat-tile';
import { Surface } from '@/components/ui/surface';
import { ThemedText } from '@/components/ui/themed-text';
import { useEntryIndex, useHabits } from '@/hooks/use-habits';
import { useToday } from '@/hooks/use-today';
import { habitStats, overallRatioForDay, type HabitStats } from '@/lib/stats';
import { habitColors, radius, screenPadding, spacing, useTheme } from '@/theme';
import type { EntryIndex, Habit } from '@/types/habit';

const EMPTY_INDEX: EntryIndex = new Map();

function HabitRateRow({ habit, stats }: { habit: Habit; stats: HabitStats }) {
  const { colors, scheme } = useTheme();
  const color = habitColors[habit.color][scheme];
  return (
    <Link href={{ pathname: '/habit/[id]', params: { id: habit.id } }} asChild>
      <Pressable
        accessibilityLabel={`${habit.name}, ${formatPercent(stats.completionRate)} over 30 days, ${formatStreak(stats.currentStreak)} streak`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          padding: spacing.md,
          borderRadius: radius.md,
          backgroundColor: pressed ? colors.surfacePressed : 'transparent',
        })}>
        <IconTile icon={habit.icon} color={color} size="sm" />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
            <ThemedText variant="callout" numberOfLines={1} style={{ flexShrink: 1 }}>
              {habit.name}
            </ThemedText>
            <ThemedText variant="footnote" tone="secondary" style={{ fontVariant: ['tabular-nums'] }}>
              {formatPercent(stats.completionRate)}
            </ThemedText>
          </View>
          <ProgressBar progress={stats.completionRate} color={color} />
        </View>
      </Pressable>
    </Link>
  );
}

export default function StatsScreen() {
  const { colors } = useTheme();
  const today = useToday();
  const habitsQuery = useHabits();
  const entriesQuery = useEntryIndex();

  const habits = habitsQuery.data ?? [];
  const entries = entriesQuery.data ?? EMPTY_INDEX;
  const loading = habitsQuery.status === 'loading' || entriesQuery.status === 'loading';

  const perHabit = habits.map((habit) => ({
    habit,
    stats: habitStats(habit, entries.get(habit.id) ?? new Map(), today),
  }));
  const bestCurrent = Math.max(0, ...perHabit.map((p) => p.stats.currentStreak));
  const bestEver = Math.max(0, ...perHabit.map((p) => p.stats.bestStreak));
  const checkIns = perHabit.reduce((sum, p) => sum + p.stats.totalCompletions, 0);
  const avgRate = perHabit.length ? perHabit.reduce((s, p) => s + p.stats.completionRate, 0) / perHabit.length : 0;

  return (
    <>
      <Stack.Screen options={{ title: 'Stats' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: screenPadding, gap: spacing.lg, paddingBottom: spacing.xxxl }}>
        {loading ? null : habits.length === 0 ? (
          <EmptyState
            icon="chart"
            title="No stats yet"
            message="Add a habit and check it off — your consistency will show up here."
          />
        ) : (
          <>
            <StatGrid>
              <StatTile icon="percent" label="30-day rate" value={formatPercent(avgRate)} color={colors.tint} />
              <StatTile icon="flame" label="Current streak" value={formatStreak(bestCurrent)} color={colors.streak} />
              <StatTile icon="trophy" label="Best streak" value={formatStreak(bestEver)} color={colors.award} />
              <StatTile icon="total" label="Check-ins" value={checkIns.toLocaleString()} color={colors.positive} />
            </StatGrid>

            <SectionHeader title="Consistency" trailing="Last 12 months" />
            <Surface style={{ gap: spacing.md }}>
              <YearHeatmap
                endDate={today}
                color={colors.tint}
                getRatio={(day) => overallRatioForDay(habits, entries, day)}
                accessibilityLabel="Overall consistency across all habits for the last year"
              />
              <HeatmapLegend color={colors.tint} />
            </Surface>

            <SectionHeader title="By habit" trailing="Last 30 days" />
            <Surface padding="none" style={{ padding: spacing.xs }}>
              {perHabit.map(({ habit, stats }) => (
                <HabitRateRow key={habit.id} habit={habit} stats={stats} />
              ))}
            </Surface>
          </>
        )}
      </ScrollView>
    </>
  );
}
