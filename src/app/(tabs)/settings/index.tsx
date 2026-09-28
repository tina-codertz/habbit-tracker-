import { Button, FieldGroup, Host, Picker, Row, Spacer, Text } from '@expo/ui';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { Alert, Linking } from 'react-native';

import { useHabitActions } from '@/hooks/use-habit-actions';
import { setThemePreference, useThemePreference, type ThemePreference } from '@/lib/theme-preference';
import { useTheme } from '@/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const preference = useThemePreference();
  const { deleteEverything } = useHabitActions();

  const confirmDeleteAll = () =>
    Alert.alert('Delete all data?', 'Every habit, check-in and reminder will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete everything', style: 'destructive', onPress: deleteEverything },
    ]);

  return (
    <>
      <Stack.Screen options={{ title: 'Settings', headerTransparent: false }} />
      <Host style={{ flex: 1 }} seedColor={colors.tint}>
        <FieldGroup>
          <FieldGroup.Section title="Appearance">
            <Row alignment="center">
              <Text>Theme</Text>
              <Spacer flexible />
              <Picker<ThemePreference> selectedValue={preference} onValueChange={setThemePreference}>
                <Picker.Item label="System" value="system" />
                <Picker.Item label="Light" value="light" />
                <Picker.Item label="Dark" value="dark" />
              </Picker>
            </Row>
          </FieldGroup.Section>

          <FieldGroup.Section title="Reminders">
            <Button label="Notification settings" variant="text" onPress={() => Linking.openSettings()} />
            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 13, color: colors.textSecondary }}>
                Set a daily reminder for each habit when you create or edit it.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="Your data">
            <Button variant="text" onPress={confirmDeleteAll}>
              <Text textStyle={{ color: colors.danger }}>Delete all data</Text>
            </Button>
            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 13, color: colors.textSecondary }}>
                Everything is stored privately on this device. Nothing is sent to a server.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="About">
            <Row alignment="center">
              <Text>Version</Text>
              <Spacer flexible />
              <Text textStyle={{ color: colors.textSecondary }}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
            </Row>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
