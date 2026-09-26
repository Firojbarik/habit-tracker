import type { Habit } from '../types/habit'
import HabitRow from './HabitRow'

interface HabitListProps {
  habits: Habit[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, updates: { name: string; scheduled_days: string }) => void
}

function HabitList({ habits, onToggle, onDelete, onEdit }: HabitListProps) {
  return (
    <ul className="space-y-3">
      {habits.map((habit) => (
        <HabitRow key={habit.id} habit={habit} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </ul>
  )
}

export default HabitList