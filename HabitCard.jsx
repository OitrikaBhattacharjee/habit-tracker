import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitsContext.jsx';
import { calcCurrentStreak, calcLongestStreak } from '../utils/streakUtils.js';
import { todayKey, addDays } from '../utils/dateUtils.js';

export default function HabitCard({ habit, onLinkPomodoro, pomodoroLinkedId }) {
  const { toggleCheckin, freeze, spendFreeze, freezesForHabit } = useHabits();
  const [justChecked, setJustChecked] = useState(false);

  const today = todayKey();
  const yesterday = addDays(today, -1);
  const freezes = freezesForHabit(habit.id);
  const doneToday = Boolean(habit.checkins[today]);
  const missedYesterday = !habit.checkins[yesterday] && !freezes[yesterday];

  const currentStreak = calcCurrentStreak(habit.checkins, freezes);
  const longestStreak = calcLongestStreak(habit.checkins, freezes);

  useEffect(() => {
    if (!justChecked) return;
    const t = setTimeout(() => setJustChecked(false), 420);
    return () => clearTimeout(t);
  }, [justChecked]);

  function handleToggle() {
    toggleCheckin(habit.id, today);
    if (!doneToday) setJustChecked(true);
  }

  function handleFreeze() {
    const ok = spendFreeze(habit.id, yesterday);
    if (!ok) return;
  }

  return (
    <div className={`habit-card ${justChecked ? 'just-checked' : ''}`}>
      <div className="tag-bar" style={{ background: habit.color }} />
      <div className="top-row">
        <div>
          <div className="h-title">{habit.name}</div>
          <div className="h-cat">{habit.category} · {habit.frequency}</div>
        </div>
      </div>

      <div className="streak-row">
        <div className="streak-pill">
          <span className="num">🔥 {currentStreak}</span>
          <span className="lbl">Current</span>
        </div>
        <div className="streak-pill">
          <span className="num">🏆 {longestStreak}</span>
          <span className="lbl">Longest</span>
        </div>
      </div>

      <button className={`check-toggle ${doneToday ? 'done' : ''}`} onClick={handleToggle}>
        {doneToday ? '✓ Done today' : 'Mark done today'}
      </button>

      {missedYesterday && (
        <button
          className="freeze-link"
          disabled={!freeze.available}
          onClick={handleFreeze}
          title={freeze.available ? 'Protect yesterday with your weekly freeze token' : 'No freeze token left this week'}
        >
          {freeze.available ? '❄ Use freeze token to protect yesterday' : 'Freeze token used this week'}
        </button>
      )}

      {onLinkPomodoro && (
        <button
          className="freeze-link"
          style={{ color: pomodoroLinkedId === habit.id ? 'var(--ember-deep)' : undefined }}
          onClick={() => onLinkPomodoro(habit.id)}
        >
          {pomodoroLinkedId === habit.id ? '⏱ Linked to Pomodoro' : 'Link to Pomodoro timer'}
        </button>
      )}
    </div>
  );
}
