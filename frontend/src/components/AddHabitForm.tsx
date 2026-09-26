import { useState } from 'react'
import { createHabit } from '../api/habits'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface AddHabitFormProps {
  onHabitAdded: () => void
}

function AddHabitForm({ onHabitAdded }: AddHabitFormProps) {
  const [name, setName] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim() === '') {
      setError('Habit name is required.')
      return
    }
    if (selectedDays.length === 0) {
      setError('Select at least one day.')
      return
    }

    setSubmitting(true)
    try {
      await createHabit(name.trim(), selectedDays.join(','))
      setName('')
      setSelectedDays([])
      onHabitAdded()
    } catch {
      setError('Could not create habit. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit name"
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            type="button"
            key={day}
            onClick={() => toggleDay(day)}
            className={`px-3 py-1 rounded text-sm ${
              selectedDays.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Habit'}
      </button>
    </form>
  )
}

export default AddHabitForm