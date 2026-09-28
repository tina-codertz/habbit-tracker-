import type { ReactNode } from 'react';
import { TextInput, View } from 'react-native';

import { IconTile } from '@/components/ui/icon-tile';
import { Stepper } from '@/components/ui/stepper';
import { ThemedText } from '@/components/ui/themed-text';
import { MAX_GOAL, type HabitForm } from '@/hooks/use-habit-form';
import { radius, spacing, typography, useHabitColor, useTheme } from '@/theme';

import { ColorPicker } from './color-picker';
import { formatGoal } from './format';
import { IconPicker } from './icon-picker';
import { ReminderField } from './reminder-field';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <ThemedText variant="footnote" tone="secondary" style={{ paddingHorizontal: spacing.xs }}>
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

/** Every editable habit field, bound to a `useHabitForm()` instance. */
export function HabitFormFields({ form }: { form: HabitForm }) {
  const { colors } = useTheme();
  const { values, set } = form;
  const color = useHabitColor(values.color);

  const inputStyle = {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: 'continuous' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  };

  return (
    <View style={{ gap: spacing.xl }}>
      <View style={{ alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm }}>
        <IconTile icon={values.icon} color={color} size="lg" />
      </View>

      <Field label="Name">
        <TextInput
          value={values.name}
          onChangeText={(text) => set('name', text)}
          placeholder="e.g. Drink water"
          placeholderTextColor={colors.textTertiary}
          maxLength={40}
          autoFocus={!values.name}
          returnKeyType="done"
          accessibilityLabel="Habit name"
          selectionColor={color}
          style={inputStyle}
        />
      </Field>

      <Field label="Color">
        <ColorPicker value={values.color} onChange={(c) => set('color', c)} />
      </Field>

      <Field label="Icon">
        <IconPicker value={values.icon} color={color} onChange={(i) => set('icon', i)} />
      </Field>

      <Field label="Daily goal">
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderCurve: 'continuous',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            gap: spacing.md,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText variant="callout">{formatGoal({ goal: values.goal, unit: values.unit })}</ThemedText>
            <Stepper
              label="Daily goal"
              value={values.goal}
              min={1}
              max={MAX_GOAL}
              onChange={(g) => set('goal', g)}
            />
          </View>
          {values.goal > 1 && (
            <TextInput
              value={values.unit}
              onChangeText={(text) => set('unit', text)}
              placeholder="Unit (e.g. glasses, pages, minutes)"
              placeholderTextColor={colors.textTertiary}
              maxLength={20}
              accessibilityLabel="Goal unit"
              selectionColor={color}
              style={{ ...inputStyle, backgroundColor: colors.surfaceRaised, paddingVertical: spacing.md }}
            />
          )}
        </View>
      </Field>

      <Field label="Reminder">
        <ReminderField
          enabled={values.reminderEnabled}
          time={values.reminderTime}
          accentColor={color}
          onToggle={(on) => set('reminderEnabled', on)}
          onChangeTime={(t) => set('reminderTime', t)}
        />
      </Field>
    </View>
  );
}
