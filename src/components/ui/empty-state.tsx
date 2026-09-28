import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { AppIconName } from '@/constants/habit-icons';
import { spacing, useTheme } from '@/theme';

import { IconTile } from './icon-tile';
import { ThemedText } from './themed-text';

type EmptyStateProps = {
  icon: AppIconName;
  title: string;
  message: string;
  /** Optional call to action, e.g. a Button. */
  children?: ReactNode;
};

export function EmptyState({ icon, title, message, children }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl }}>
      <IconTile icon={icon} color={colors.tint} size="lg" />
      <View style={{ alignItems: 'center', gap: spacing.xs }}>
        <ThemedText variant="title" style={{ textAlign: 'center' }}>
          {title}
        </ThemedText>
        <ThemedText variant="subhead" tone="secondary" style={{ textAlign: 'center' }}>
          {message}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}
