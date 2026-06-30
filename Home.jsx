import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitsContext.jsx';
import { calcCurrentStreak, calcCompletionRate } from '../utils/streakUtils.js';

export default function Home() {
  const navigate = useNavigate();
  const { habits, totalCheckinsAllTime, freezesForHabit } = useHabits();

  const overallStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((h) => calcCurrentStreak(h.checkins, freezesForHabit(h.id))));
  }, [habits, freezesForHabit]);

  const overallCompletion = useMemo(() => {
    if (habits.length === 0) return 0;
    const sum = habits.reduce((acc, h) => acc + calcCompletionRate(h.checkins, 7), 0);
    return Math.round(sum / habits.length);
  }, [habits]);

  return (
    <div className="container">
      <section className="hero">
        <div>
          <span className="eyebrow">Habit Tracker &amp; Streak Dashboard</span>
          <h1>
            Small fires, <em>kept burning</em>.
          </h1>
          <p className="hero-lede">
            Ember helps you build routines that actually stick. Log a check-in, watch your
            streak grow, and let the consistency grid show you the shape of your discipline
            over time.
          </p>

          <div className="hero-stats">
            <div className="stat-block">
              <span className="stat-num">{overallStreak}</span>
              <span className="stat-label">Day streak</span>
            </div>
            <div className="stat-block">
              <span className="stat-num">{overallCompletion}%</span>
              <span className="stat-label">7-day completion</span>
            </div>
            <div className="stat-block">
              <span className="live-counter stat-num">
                <span className="pulse-num">{totalCheckinsAllTime}</span>
              </span>
              <span className="stat-label">Total check-ins logged</span>
            </div>
          </div>

          <button className="btn btn-ember" onClick={() => navigate('/dashboard')}>
            Begin Tracking →
          </button>
        </div>

        <div className="hero-art" aria-hidden="true">
          <HeroIllustration />
        </div>
      </section>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="210" cy="210" r="190" fill="#FFFFFF" stroke="#E2D9C9" strokeWidth="2" />
      <g opacity="0.9">
        <rect x="90" y="260" width="40" height="60" rx="8" fill="#E2D9C9" />
        <rect x="150" y="220" width="40" height="100" rx="8" fill="#C9A87C" />
        <rect x="210" y="180" width="40" height="140" rx="8" fill="#E8622C" />
        <rect x="270" y="140" width="40" height="180" rx="8" fill="#5B7A5A" />
      </g>
      <path
        d="M290 80c1.5 5-3 6.5-3 11.5a4.7 4.7 0 1 0 9.4 0c3 1.6 4.6 4.6 4.6 8.5a10.5 10.5 0 1 1-21 0c0-4.6 2.3-6 1.5-9.2 1.5.8 3 .8 4.6-.7-1.3-2.4-3.3-5.2-1.6-10.1z"
        fill="#E8622C"
      />
      <circle cx="120" cy="130" r="6" fill="#E8622C" opacity="0.6" />
      <circle cx="330" cy="240" r="5" fill="#5B7A5A" opacity="0.6" />
      <circle cx="100" cy="320" r="4" fill="#C9A87C" opacity="0.8" />
    </svg>
  );
}
