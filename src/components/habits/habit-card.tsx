import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Heatmap } from '@/components/heatmap/heatmap';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { ThemedText } from '@/components/ui/themed-text';
import type { DateKey } from '@/lib/dates';
import { currentStreak, progressRatio } from '@/lib/stats';
import { radius, spacing, useHabitColor, useTheme } from '@/theme';
import type { DayCounts, Habit } from '@/types/habit';

import { formatGoal } from './format';
import { HabitCheckButton } from './habit-check-button';

type HabitCardProps = {
  habit: Habit;
  counts: DayCounts;
  today: DateKey;
  onChangeCount: (count: number) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const CARD_WEEKS = 20;

export function HabitCard({ habit, counts, today, onChangeCount, onEdit, onDelete }: HabitCardProps) {
  const { colors } = useTheme();
  const color = useHabitColor(habit.color);
  const count = counts.get(today) ?? 0;
  const streak = currentStreak(counts, habit.goal, today);

  const meta = habit.goal > 1 ? `${count}/${formatGoal(habit)}` : count >= habit.goal ? 'Done today' : 'Not yet today';

  return (
    <Link href={{ pathname: '/habit/[id]', params: { id: habit.id } }} asChild>
      <Link.Trigger>
        <Pressable
          accessibilityHint="Opens habit details"
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.surfacePressed : colors.surface,
            borderRadius: radius.lg,
            borderCurve: 'continuous',
            padding: spacing.lg,
            gap: spacing.lg,
          })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <IconTile icon={habit.icon} color={color} />
            <View style={{ flex: 1, gap: spacing.xxs }}>
              <ThemedText variant="headline" numberOfLines={1}>
                {habit.name}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
                {streak > 0 && (
                  <>
                    <Icon name="flame" size={13} color={colors.textSecondary} />
                    <ThemedText variant="footnote" tone="secondary">
                      {streak}
                    </ThemedText>
                    <ThemedText variant="footnote" tone="tertiary">
                      ·
                    </ThemedText>
                  </>
                )}
                <ThemedText variant="footnote" tone="secondary" numberOfLines={1} style={{ flexShrink: 1 }}>
                  {meta}
                </ThemedText>
              </View>
            </View>
            <HabitCheckButton habit={habit} color={color} count={count} onChange={onChangeCount} />
          </View>
          <Heatmap
            endDate={today}
            weeks={CARD_WEEKS}
            color={color}
            getRatio={(day) => (day < habit.createdAt ? null : progressRatio(counts.get(day) ?? 0, habit.goal))}
            accessibilityLabel={`${habit.name} history for the last ${CARD_WEEKS} weeks`}
          />
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction icon="pencil" onPress={onEdit}>
          Edit
        </Link.MenuAction>
        <Link.MenuAction icon="trash" destructive onPress={onDelete}>
          Delete
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
}
