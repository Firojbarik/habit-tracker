from datetime import date as date_type, datetime
from pydantic import BaseModel
from typing import Optional


class HabitCreate(BaseModel):
    name: str
    scheduled_days: str


class HabitOut(BaseModel):
    id: int
    name: str
    scheduled_days: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    scheduled_days: Optional[str] = None
    is_active: Optional[bool] = None


class CompletionCreate(BaseModel):
    habit_id: int
    date: Optional[date_type] = None


class CompletionOut(BaseModel):
    id: int
    habit_id: int
    date: date_type
    completed_at: datetime

    class Config:
        from_attributes = True

class HabitToday(BaseModel):
    id: int
    name: str
    scheduled_days: str
    completed: bool
    completion_id: Optional[int] = None

class HabitToday(BaseModel):
    id: int
    name: str
    scheduled_days: str
    completed: bool
    completion_id: Optional[int] = None
    streak: int