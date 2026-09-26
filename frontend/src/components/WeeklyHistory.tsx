import { useState, useEffect } from 'react'
import { getHabitHistory, type HistoryDay } from '../api/habits'

interface WeeklyHistoryProps {
  habitId: number
  completed: boolean
  completionId: number | null
}

function WeeklyHistory({ habitId, completed, completionId }: WeeklyHistoryProps) {
  const [history, setHistory] = useState<HistoryDay[]>([])

  useEffect(() => {
    getHabitHistory(habitId).then(setHistory).catch(() => setHistory([]))
    // Re-fetch whenever this habit's completion state actually changes —
    // not just on first mount — so today's dot never goes stale.
  }, [habitId, completed, completionId])

  return (
    <div className="flex gap-1">
      {history.map((day) => {
        let color = 'bg-gray-100'
        if (day.scheduled && day.completed) color = 'bg-green-500'
        else if (day.scheduled && !day.completed) color = 'bg-red-200'

        return (
          <div
            key={day.date}
            title={day.date}
            className={`w-3 h-3 rounded-full ${color}`}
          />
        )
      })}
    </div>
  )
}

export default WeeklyHistory