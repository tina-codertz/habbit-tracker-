import { HabitFormScreen } from '@/components/habits/habit-form-screen';
import { useHabitActions } from '@/hooks/use-habit-actions';

export default function NewHabitScreen() {
  const { createHabit } = useHabitActions();
  return <HabitFormScreen onSubmit={createHabit} />;
}
