from typing import List
from datetime import date as date_type, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import SessionLocal
from models import Habit, Completion
from schemas import HabitCreate, HabitOut, HabitUpdate, CompletionCreate, CompletionOut, HabitToday
from streaks import calculate_streak

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/habits/inactive", response_model=List[HabitOut])
def get_inactive_habits(db: Session = Depends(get_db)):
    return db.query(Habit).filter(Habit.is_active == False).all()


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

        all_completions = db.query(Completion).filter(
            Completion.habit_id == habit.id
        ).all()
        completion_dates = {c.date for c in all_completions}

        streak = calculate_streak(
            scheduled_days=habit.scheduled_days,
            completion_dates=completion_dates,
            habit_created_date=habit.created_at.date(),
            today=today,
        )

        result.append({
            "id": habit.id,
            "name": habit.name,
            "scheduled_days": habit.scheduled_days,
            "completed": completion is not None,
            "completion_id": completion.id if completion else None,
            "streak": streak,
        })
    return result


@app.get("/habits/{habit_id}/history")
def get_habit_history(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = date_type.today()
    last_7_dates = [today - timedelta(days=i) for i in range(6, -1, -1)]

    completions = db.query(Completion).filter(
        Completion.habit_id == habit_id,
        Completion.date.in_(last_7_dates),
    ).all()
    completed_dates = {c.date for c in completions}

    scheduled = set(d.strip() for d in habit.scheduled_days.split(","))
    weekday_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return [
        {
            "date": d.isoformat(),
            "scheduled": weekday_map[d.weekday()] in scheduled,
            "completed": d in completed_dates,
        }
        for d in last_7_dates
    ]


@app.delete("/completions/{completion_id}", status_code=204)
def delete_completion(completion_id: int, db: Session = Depends(get_db)):
    completion = db.query(Completion).filter(Completion.id == completion_id).first()
    if completion is None:
        raise HTTPException(status_code=404, detail="Completion not found")
    db.delete(completion)
    db.commit()