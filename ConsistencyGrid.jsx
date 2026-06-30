import { useMemo, useState } from 'react';
import { lastNDates, formatPretty } from '../utils/dateUtils.js';
import { calcCurrentStreak } from '../utils/streakUtils.js';
import { CATEGORIES } from '../context/HabitsContext.jsx';

function motivationFor(streak) {
  if (streak === 0) return "Every streak starts with a single check-in. Today's a good day.";
  if (streak < 3) return `${streak} day${streak === 1 ? '' : 's'} in. Momentum is building.`;
  if (streak < 7) return `${streak} days strong — you're forming the groove now.`;
  if (streak < 21) return `${streak} days! This is starting to look like a real habit.`;
  if (streak < 50) return `${streak} days of showing up. That's identity-level consistency.`;
  return `${streak} days?! You're basically a habit-tracking legend at this point.`;
}

export default function ConsistencyGrid({ habits, freezesForHabit }) {
  const [range, setRange] = useState(30);
  const [category, setCategory] = useState('All');

  const dates = useMemo(() => lastNDates(range), [range]);

  const filteredHabits = useMemo(
    () => (category === 'All' ? habits : habits.filter((h) => h.category === category)),
    [habits, category]
  );

  const maxStreak = useMemo(() => {
    if (filteredHabits.length === 0) return 0;
    return Math.max(0, ...filteredHabits.map((h) => calcCurrentStreak(h.checkins, freezesForHabit(h.id))));
  }, [filteredHabits, freezesForHabit]);

  const completionsByDate = useMemo(() => {
    const map = {};
    dates.forEach((d) => {
      map[d] = filteredHabits.reduce((sum, h) => sum + (h.checkins[d] ? 1 : 0), 0);
    });
    return map;
  }, [dates, filteredHabits]);

  const habitCount = Math.max(filteredHabits.length, 1);

  function intensity(count) {
    if (count === 0) return 'var(--line)';
    const ratio = Math.min(count / habitCount, 1);
    // interpolate paper -> ember-deep
    const stops = [
      { r: 226, g: 217, b: 201 }, // line
      { r: 232, g: 98, b: 44 },   // ember
      { r: 181, g: 88, b: 44 },   // ember-deep
    ];
    const t = ratio;
    const a = stops[0], b = stops[Math.min(1 + Math.floor(t), 2)];
    const blend = (k) => Math.round(a[k] + (b[k] - a[k]) * Math.min(t * 1.6, 1));
    return `rgb(${blend('r')}, ${blend('g')}, ${blend('b')})`;
  }

  return (
    <div>
      <div className="motivation-banner">{motivationFor(maxStreak)}</div>

      <div className="chip-row">
        {['All', ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        {[7, 14, 30].map((r) => (
          <button key={r} className={`chip ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>
            {r}d
          </button>
        ))}
      </div>

      {filteredHabits.length === 0 ? (
        <div className="empty-state">No habits in this category yet.</div>
      ) : (
        <div className="heatmap-grid">
          {dates.map((d) => {
            const count = completionsByDate[d];
            return (
              <div
                key={d}
                className="heat-cell"
                style={{ background: intensity(count) }}
              >
                <span className="heat-tooltip">
                  {formatPretty(d)} · {count}/{filteredHabits.length} done
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
