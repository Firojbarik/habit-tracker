import type { Habit } from '../types/habit'

const API_BASE = 'http://localhost:8000'

export async function getTodaysHabits(): Promise<Habit[]> {
  const response = await fetch(`${API_BASE}/habits/today`)
  if (!response.ok) {
    throw new Error('Failed to fetch habits')
  }
  return response.json()
}

export async function createCompletion(habitId: number): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE}/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habit_id: habitId }),
  })
  if (!response.ok) {
    throw new Error('Failed to save completion')
  }
  return response.json()
}

export async function deleteCompletion(completionId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/completions/${completionId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to remove completion')
  }
}

export async function createHabit(name: string, scheduledDays: string): Promise<void> {
  const response = await fetch(`${API_BASE}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, scheduled_days: scheduledDays }),
  })
  if (!response.ok) {
    throw new Error('Failed to create habit')
  }
}

export async function deleteHabit(habitId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/habits/${habitId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: false }),
  })
  if (!response.ok) {
    throw new Error('Failed to delete habit')
  }
}

export async function getInactiveHabits(): Promise<Habit[]> {
  const response = await fetch(`${API_BASE}/habits/inactive`)
  if (!response.ok) {
    throw new Error('Failed to fetch inactive habits')
  }
  return response.json()
}

export async function restoreHabit(habitId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/habits/${habitId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: true }),
  })
  if (!response.ok) {
    throw new Error('Failed to restore habit')
  }
}

export async function updateHabit(
  habitId: number,
  updates: { name?: string; scheduled_days?: string }
): Promise<void> {
  const response = await fetch(`${API_BASE}/habits/${habitId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    throw new Error('Failed to update habit')
  }
}