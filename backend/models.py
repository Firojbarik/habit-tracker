from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    scheduled_days = Column(String, nullable=False)  # e.g. "Mon,Wed,Fri"
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    completions = relationship("Completion", back_populates="habit")


class Completion(Base):
    __tablename__ = "completions"
    __table_args__ = (UniqueConstraint("habit_id", "date", name="uq_habit_date"),)

    id = Column(Integer, primary_key=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    date = Column(Date, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)

    habit = relationship("Habit", back_populates="completions")