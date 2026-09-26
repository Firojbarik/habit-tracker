import { useState, useEffect } from 'react'
import type { Habit } from '../types/habit'
import { getInactiveHabits, restoreHabit } from '../api/habits'

interface DeletedHabitsProps {
  onRestored: () => void
}

function DeletedHabits({ onRestored }: DeletedHabitsProps) {
  const [open, setOpen] = useState(false)
  const [inactiveHabits, setInactiveHabits] = useState<Habit[]>([])

  useEffect(() => {
    if (open) {
      getInactiveHabits().then(setInactiveHabits).catch(() => setInactiveHabits([]))
    }
  }, [open])

  async function handleRestore(id: number) {
    try {
      await restoreHabit(id)
      setInactiveHabits((current) => current.filter((h) => h.id !== id))
      onRestored()
    } catch {
      alert('Could not restore habit. Try again.')
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        {open ? '▾' : '▸'} Deleted habits
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {inactiveHabits.length === 0 && (
            <li className="text-sm text-gray-400">Nothing deleted.</li>
          )}
          {inactiveHabits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm"
            >
              <span className="text-gray-500">{habit.name}</span>
              <button
                onClick={() => handleRestore(habit.id)}
                className="text-blue-600 hover:underline"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DeletedHabits