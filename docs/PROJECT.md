# Project Status

## Completed
- Phase 1: Planning (vision, MVP scope, architecture)
- Phase 2: Project structure (folders + docs)
- Phase 3: Environment setup (verified tools, venv, VS Code interpreter)
- Phase 4: Git initialized, .gitignore configured, pushed to GitHub
- Phase 5: Database schema designed (habits + completions), SQLAlchemy models, SQLite file created
- Phase 6: FastAPI backend — list/create/update/soft-delete habits, mark completions (duplicate + orphan protection), "today's habits" endpoint
- Phase 7: React + TypeScript + Tailwind frontend — habit list UI with local toggle state (placeholder data, not yet connected to backend)

## Current Phase
Phase 8 — API Integration (connecting frontend to real backend data)

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
Phase 8.1 — Fetching real habits from the backend on page load