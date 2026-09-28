import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/ui/themed-text';
import { useHabitForm } from '@/hooks/use-habit-form';
import { screenPadding, spacing } from '@/theme';
import type { Habit, HabitInput } from '@/types/habit';

import { HabitFormFields } from './habit-form-fields';

function HeaderTextButton({
  title,
  onPress,
  disabled,
  bold,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  bold?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: disabled ? 0.35 : pressed ? 0.6 : 1, paddingHorizontal: spacing.xs })}>
      <ThemedText variant="callout" tone="tint" style={bold ? { fontWeight: '600' } : undefined}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

type HabitFormScreenProps = {
  habit?: Habit;
  onSubmit: (input: HabitInput) => Promise<unknown>;
  onDelete?: () => void;
};

/** Modal form for creating or editing a habit. Stays open with the draft intact if saving fails. */
export function HabitFormScreen({ habit, onSubmit, onDelete }: HabitFormScreenProps) {
  const form = useHabitForm(habit);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.isValid || saving) return;
    setSaving(true);
    try {
      await onSubmit(form.toInput());
      router.back();
    } catch (e) {
      setSaving(false);
      Alert.alert('Couldn’t save habit', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderTextButton title="Cancel" onPress={() => router.back()} />,
          headerRight: () => (
            <HeaderTextButton title="Save" bold onPress={save} disabled={!form.isValid || saving} />
          ),
        }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ padding: screenPadding, gap: spacing.xl, paddingBottom: spacing.xxxl }}>
        <HabitFormFields form={form} />
        {onDelete && <Button title="Delete habit" icon="trash" variant="destructive" onPress={onDelete} />}
      </ScrollView>
    </>
  );
}
