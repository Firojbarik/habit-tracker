import { useState } from 'react'
import type { Habit } from '../types/habit'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface HabitRowProps {
  habit: Habit
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, updates: { name: string; scheduled_days: string }) => void
}

function HabitRow({ habit, onToggle, onDelete, onEdit }: HabitRowProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(habit.name)
  const [days, setDays] = useState<string[]>(habit.scheduled_days.split(','))

  function toggleDay(day: string) {
    setDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    )
  }

  function handleSave() {
    if (name.trim() === '' || days.length === 0) return
    onEdit(habit.id, { name: name.trim(), scheduled_days: days.join(',') })
    setEditing(false)
  }

  function handleCancel() {
    setName(habit.name)
    setDays(habit.scheduled_days.split(','))
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="bg-white rounded-lg shadow-sm px-4 py-3 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              type="button"
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-2 py-1 rounded text-xs ${
                days.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-sm">
          <button type="button" onClick={handleSave} className="text-blue-600">Save</button>
          <button type="button" onClick={handleCancel} className="text-gray-400">Cancel</button>
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-gray-800">{habit.name}</span>
        {habit.streak > 0 && (
          <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
            🔥 {habit.streak}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={habit.completed} onChange={() => onToggle(habit.id)} />
        <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-blue-500 text-sm" aria-label={`Edit ${habit.name}`}>
          ✏️
        </button>
        <button onClick={() => onDelete(habit.id)} className="text-gray-400 hover:text-red-500 text-sm" aria-label={`Delete ${habit.name}`}>
          🗑
        </button>
      </div>
    </li>
  )
}

export default HabitRow