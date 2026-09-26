import { useState, useEffect } from 'react'
import HabitList from './components/HabitList'
import AddHabitForm from './components/AddHabitForm'
import type { Habit } from './types/habit'
import { getTodaysHabits, createCompletion, deleteCompletion } from './api/habits'

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function loadHabits() {
    setLoading(true)
    getTodaysHabits()
      .then((data) => {
        setHabits(data)
        setError(null)
      })
      .catch(() => setError('Could not load habits. Is the backend running?'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadHabits()
  }, [])

async function toggleHabit(id: number) {
  const habit = habits.find((h) => h.id === id)
  if (!habit) return

  if (habit.completed) {
    if (habit.completion_id === null) return
    const idToDelete = habit.completion_id

    setHabits(
      habits.map((h) => (h.id === id ? { ...h, completed: false, completion_id: null } : h))
    )

    try {
      await deleteCompletion(idToDelete)
    } catch {
      setHabits((current) =>
        current.map((h) => (h.id === id ? { ...h, completed: true, completion_id: idToDelete } : h))
      )
      alert('Could not undo — check your connection and try again.')
    }
  } else {
    setHabits(habits.map((h) => (h.id === id ? { ...h, completed: true } : h)))

    try {
      const completion = await createCompletion(id)
      setHabits((current) =>
        current.map((h) => (h.id === id ? { ...h, completion_id: completion.id } : h))
      )
    } catch {
      setHabits((current) => current.map((h) => (h.id === id ? { ...h, completed: false } : h)))
      alert('Could not save — check your connection and try again.')
    }
  }
}
return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Habit Tracker</h1>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <AddHabitForm onHabitAdded={loadHabits} />
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <HabitList habits={habits} onToggle={toggleHabit} />}
      </main>
    </div>
  )
}

export default App