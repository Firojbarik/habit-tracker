export interface Habit {
  id: number;
  name: string;
  scheduled_days: string;
  completed: boolean;
  completion_id: number | null;
}

export interface Habit {
  id: number
  name: string
  scheduled_days: string
  completed: boolean
  completion_id: number | null
  streak: number
}