import { useState } from 'react'
import HabitList from './components/HabitList'
import type { Habit } from './types/habit'

const initialHabits: Habit[] = [
  { id: 1, name: 'Drink water', scheduled_days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', completed: true, completion_id: 5 },
  { id: 2, name: 'Read 10 pages', scheduled_days: 'Mon,Wed,Fri', completed: false, completion_id: null },
  { id: 3, name: 'Gym', scheduled_days: 'Mon,Wed,Fri', completed: false, completion_id: null },
]

function App() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)

  function toggleHabit(id: number) {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Habit Tracker</h1>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-8">
        <HabitList habits={habits} onToggle={toggleHabit} />
      </main>
    </div>
  )
}

export default App