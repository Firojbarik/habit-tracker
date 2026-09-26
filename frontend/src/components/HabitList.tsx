import type { Habit } from '../types/habit'

interface HabitListProps {
  habits: Habit[]
  onToggle: (id: number) => void
}

function HabitList({ habits, onToggle }: HabitListProps) {
  return (
    <ul className="space-y-3">
      {habits.map((habit) => (
        <li
          key={habit.id}
          className="flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-800">{habit.name}</span>
            {habit.streak > 0 && (
              <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                🔥 {habit.streak}
              </span>
            )}
          </div>
          <input
            type="checkbox"
            checked={habit.completed}
            onChange={() => onToggle(habit.id)}
          />
        </li>
      ))}
    </ul>
  )
}

export default HabitList
