from datetime import date
from streaks import calculate_streak

# Scenario 1: perfect 3-day streak, checked while today is still pending
result_1 = calculate_streak(
    scheduled_days="Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    completion_dates={date(2026, 9, 21), date(2026, 9, 22), date(2026, 9, 23)},
    habit_created_date=date(2026, 9, 21),
    today=date(2026, 9, 24),
)
assert result_1 == 3, f"Scenario 1 failed: expected 3, got {result_1}"

# Scenario 2: one miss forgiven — streak survives
result_2 = calculate_streak(
    scheduled_days="Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    completion_dates={date(2026, 9, 21), date(2026, 9, 22), date(2026, 9, 24)},  # 23rd missing
    habit_created_date=date(2026, 9, 21),
    today=date(2026, 9, 25),
)
assert result_2 == 3, f"Scenario 2 failed: expected 3, got {result_2}"

# Scenario 3: Step 9.1's challenge question — two misses in a row breaks it to 0
result_3 = calculate_streak(
    scheduled_days="Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    completion_dates={date(2026, 9, 21), date(2026, 9, 22), date(2026, 9, 24)},  # 23rd, 25th, 26th missing
    habit_created_date=date(2026, 9, 21),
    today=date(2026, 9, 27),
)
assert result_3 == 0, f"Scenario 3 failed: expected 0, got {result_3}"

print("All streak tests passed!")