import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHabits } from '../context/HabitsContext.jsx';
import HabitCard from '../components/HabitCard.jsx';
import Pomodoro from '../components/Pomodoro.jsx';
import ConsistencyGrid from '../components/ConsistencyGrid.jsx';
import { todayKey } from '../utils/dateUtils.js';

export default function Dashboard() {
  const { habits, freezesForHabit } = useHabits();
  const [linkedId, setLinkedId] = useState(null);

  const today = todayKey();
  const doneCount = habits.filter((h) => h.checkins[today]).length;
  const progressPct = habits.length === 0 ? 0 : Math.round((doneCount / habits.length) * 100);

  return (
    <div className="container section">
      <div className="dash-header">
        <div>
          <h2>Today's habits</h2>
          <p style={{ marginBottom: 0 }}>
            {habits.length === 0
              ? "You haven't added any habits yet."
              : `${doneCount} of ${habits.length} done today.`}
          </p>
        </div>
        {habits.length > 0 && (
          <div style={{ minWidth: 220 }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{progressPct}% complete</span>
          </div>
        )}
      </div>

      {habits.length === 0 ? (
        <div className="empty-state card card-pad">
          No habits to track yet.{' '}
          <Link to="/habits" style={{ color: 'var(--ember-deep)', fontWeight: 600 }}>
            Add your first habit →
          </Link>
        </div>
      ) : (
        <div className="habit-grid">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onLinkPomodoro={setLinkedId} pomodoroLinkedId={linkedId} />
          ))}
        </div>
      )}

      {habits.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <Pomodoro habits={habits} linkedId={linkedId} setLinkedId={setLinkedId} />
        </div>
      )}

      <h2 style={{ marginBottom: 6 }}>Consistency grid</h2>
      <p style={{ marginBottom: 20 }}>Your check-in history, visualized.</p>
      <ConsistencyGrid habits={habits} freezesForHabit={freezesForHabit} />
    </div>
  );
}
