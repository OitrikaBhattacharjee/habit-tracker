import { useMemo } from 'react';
import { useHabits } from '../context/HabitsContext.jsx';
import {
  calcCurrentStreak,
  calcLongestStreak,
  calcCompletionRate,
  calcMomentum,
} from '../utils/streakUtils.js';

function momentumColor(score) {
  if (score >= 75) return 'var(--sage)';
  if (score >= 45) return 'var(--ember)';
  return 'var(--danger)';
}

export default function Insights() {
  const { habits, freezesForHabit } = useHabits();

  const rows = useMemo(
    () =>
      habits.map((h) => {
        const freezes = freezesForHabit(h.id);
        return {
          ...h,
          current: calcCurrentStreak(h.checkins, freezes),
          longest: calcLongestStreak(h.checkins, freezes),
          rate7: calcCompletionRate(h.checkins, 7),
          rate30: calcCompletionRate(h.checkins, 30),
          momentum: calcMomentum(h.checkins, 30),
        };
      }),
    [habits, freezesForHabit]
  );

  const totalHabits = habits.length;
  const avgCompletion = totalHabits === 0 ? 0 : Math.round(rows.reduce((s, r) => s + r.rate7, 0) / totalHabits);
  const longestOverall = totalHabits === 0 ? 0 : Math.max(...rows.map((r) => r.longest));
  const currentOverall = totalHabits === 0 ? 0 : Math.max(...rows.map((r) => r.current));

  const bestHabit = useMemo(() => {
    if (rows.length === 0) return null;
    return rows.reduce((best, r) => (r.rate30 > best.rate30 ? r : best), rows[0]);
  }, [rows]);

  return (
    <div className="container section">
      <h2>Insights</h2>
      <p style={{ marginBottom: 32 }}>The numbers behind the streaks.</p>

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="num">{totalHabits}</div>
          <div className="lbl">Total habits</div>
        </div>
        <div className="card stat-card">
          <div className="num">{avgCompletion}%</div>
          <div className="lbl">Completion rate</div>
        </div>
        <div className="card stat-card">
          <div className="num">{longestOverall}</div>
          <div className="lbl">Longest streak</div>
        </div>
        <div className="card stat-card">
          <div className="num">{currentOverall}</div>
          <div className="lbl">Current streak</div>
        </div>
      </div>

      {bestHabit && (
        <div className="best-habit-banner">
          <span style={{ fontSize: '2.2rem' }}>🏆</span>
          <div>
            <strong>Best habit: {bestHabit.name}</strong>
            <p style={{ margin: 0 }}>
              {bestHabit.rate30}% completion over the last 30 days — your most reliable routine right now.
            </p>
          </div>
        </div>
      )}

      {totalHabits === 0 ? (
        <div className="empty-state">Add a habit to start seeing insights.</div>
      ) : (
        <div className="habit-grid">
          {rows.map((r) => (
            <div className="card card-pad" key={r.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className="color-dot" style={{ background: r.color }} />
                <strong>{r.name}</strong>
              </div>
              <p style={{ marginBottom: 6 }}>🔥 Current streak: {r.current} days</p>
              <p style={{ marginBottom: 14 }}>📅 7-day completion: {r.rate7}%</p>

              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 2 }}>
                Habit Momentum — {r.momentum}/100
              </div>
              <div className="momentum-bar-track">
                <div
                  className="momentum-bar-fill"
                  style={{ width: `${r.momentum}%`, background: momentumColor(r.momentum) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
