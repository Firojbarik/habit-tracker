from typing import List
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Habit
from schemas import HabitCreate, HabitOut
from fastapi import FastAPI, Depends, HTTPException
from schemas import HabitCreate, HabitOut, HabitUpdate
from datetime import date as date_type
from sqlalchemy.exc import IntegrityError
from models import Habit, Completion
from schemas import HabitCreate, HabitOut, HabitUpdate, CompletionCreate, CompletionOut, HabitToday


app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"status": "Habit Tracker API is running"}


@app.get("/habits", response_model=List[HabitOut])
def get_habits(db: Session = Depends(get_db)):
    return db.query(Habit).filter(Habit.is_active == True).all()


@app.post("/habits", response_model=HabitOut)
def create_habit(habit: HabitCreate, db: Session = Depends(get_db)):
    new_habit = Habit(
        name=habit.name,
        scheduled_days=habit.scheduled_days,
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit


@app.patch("/habits/{habit_id}", response_model=HabitOut)
def update_habit(habit_id: int, habit_update: HabitUpdate, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    update_data = habit_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(habit, field, value)

    db.commit()
    db.refresh(habit)
    return habit


@app.post("/completions", response_model=CompletionOut)
def create_completion(completion: CompletionCreate, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(
        Habit.id == completion.habit_id, Habit.is_active == True
    ).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    completion_date = completion.date or date_type.today()

    new_completion = Completion(
        habit_id=completion.habit_id,
        date=completion_date,
    )
    db.add(new_completion)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="This habit is already marked complete for this date",
        )
    db.refresh(new_completion)
    return new_completion

@app.get("/habits/today", response_model=List[HabitToday])
def get_todays_habits(db: Session = Depends(get_db)):
    today = date_type.today()
    weekday_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    today_code = weekday_map[today.weekday()]

    habits = db.query(Habit).filter(Habit.is_active == True).all()
    result = []
    for habit in habits:
        scheduled = [d.strip() for d in habit.scheduled_days.split(",")]
        if today_code not in scheduled:
            continue

        completion = db.query(Completion).filter(
            Completion.habit_id == habit.id,
            Completion.date == today,
        ).first()

        result.append({
            "id": habit.id,
            "name": habit.name,
            "scheduled_days": habit.scheduled_days,
            "completed": completion is not None,
            "completion_id": completion.id if completion else None,
        })
    return result