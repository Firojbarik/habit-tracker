# Project Status

## Completed
- Phase 1: Planning (vision, MVP scope, architecture)
- Phase 2: Project structure (folders + docs)
- Phase 3: Environment setup (verified tools, venv, VS Code interpreter)
- Phase 4: Git initialized, .gitignore configured, pushed to GitHub
- Phase 5: Database schema designed (habits + completions), SQLAlchemy models, SQLite file created
- Phase 6: FastAPI backend — list/create/update/soft-delete habits, mark completions (duplicate + orphan protection), "today's habits" endpoint
- Phase 7: React + TypeScript + Tailwind frontend — habit list UI with local toggle state (placeholder data, not yet connected to backend)
- Phase 8: Full API integration — real habit data on load, checkbox saves/undoes completions (optimistic UI with revert-on-failure), "Add Habit" form with validation. **MVP feature-complete.**
- Phase 9: Streak counter with grace-based recovery (one missed scheduled day forgiven, two consecutive misses reset it; "today" always treated as pending, never a miss). Isolated algorithm tested with fabricated data before wiring into the real endpoint. Frontend badge shows only for streak
- Phase 9 (cont'd): Soft-delete UI with confirmation, "Deleted habits" view with real restore, inline habit editing (name + schedule) via HabitRow. All Must Have and Should Have items from Step 1.2 now built except weekly calendar view.

## Current Phase
Phase 9 — Polish & Should-Have Features

## MVP Scope (Must Have)
- Add a new habit
- View today's habits
- Mark a habit done
- Non-punitive recovery mechanic
- Phone access via home WiFi

## Key Decisions Made
- Monorepo structure: frontend/, backend/, docs/
- Soft delete (is_active) instead of hard delete, to preserve history for the recovery mechanic
- scheduled_days field supports both daily and custom weekday habits
- UNIQUE(habit_id, date) enforced at the database level, not just in application code
- Frontend components kept "dumb" (data via props) to simplify backend integration

## Next Step
Phase 9.1 — Streak Display