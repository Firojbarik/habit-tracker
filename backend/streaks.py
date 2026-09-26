from datetime import date, timedelta

WEEKDAY_MAP = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def calculate_streak(
    scheduled_days: str,
    completion_dates: set[date],
    habit_created_date: date,
    today: date,
) -> int:
    scheduled = set(d.strip() for d in scheduled_days.split(","))
    streak = 0
    grace_available = True
    current = today - timedelta(days=1)  # today is always pending, never checked

    while current >= habit_created_date:
        day_code = WEEKDAY_MAP[current.weekday()]

        if day_code not in scheduled:
            current -= timedelta(days=1)
            continue

        if current in completion_dates:
            streak += 1
            grace_available = True
        else:
            if grace_available:
                grace_available = False
            else:
                break

        current -= timedelta(days=1)

    return streak