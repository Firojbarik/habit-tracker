from database import SessionLocal
from models import Habit
from datetime import datetime

db = SessionLocal()
habit = db.query(Habit).filter(Habit.id == 17).first()
habit.created_at = datetime(2026, 9, 1)
db.commit()
print(f"Habit {habit.id} created_at is now {habit.created_at}")
db.close()