import { useEffect, useRef, useState } from 'react';
import { loadPomodoroMinutes, savePomodoroMinutes } from '../utils/storage.js';

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const RADIUS = 64;
const CIRC = 2 * Math.PI * RADIUS;

export default function Pomodoro({ habits, linkedId, setLinkedId }) {
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [minutesByHabit, setMinutesByHabit] = useState(() => loadPomodoroMinutes());
  const intervalRef = useRef(null);

  const total = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const pct = secondsLeft / total;

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // session finished: credit a full work session's minutes to the linked habit
          if (mode === 'work' && linkedId) {
            setMinutesByHabit((prev) => {
              const next = { ...prev, [linkedId]: (prev[linkedId] || 0) + 25 };
              savePomodoroMinutes(next);
              return next;
            });
          }
          const nextMode = mode === 'work' ? 'break' : 'work';
          setMode(nextMode);
          return nextMode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, linkedId]);

  function reset() {
    setRunning(false);
    setMode('work');
    setSecondsLeft(WORK_SECONDS);
  }

  function mm(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  const linkedHabit = habits.find((h) => h.id === linkedId);
  const linkedMinutes = linkedId ? minutesByHabit[linkedId] || 0 : 0;

  return (
    <div className="card pomodoro-card">
      <div className="pomo-ring-wrap">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="10" />
          <circle
            cx="75" cy="75" r={RADIUS}
            fill="none"
            stroke={mode === 'work' ? 'var(--ember)' : 'var(--sage)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="pomo-time">{mm(secondsLeft)}</div>
      </div>

      <div>
        <span className={`pomo-mode-tag ${mode}`}>{mode === 'work' ? 'Focus session' : 'Break'}</span>
        <h3 style={{ marginBottom: 6 }}>Pomodoro Timer</h3>
        <p style={{ marginBottom: 12 }}>
          25 minutes of focus, 5 minutes to breathe. Link a session to a habit to bank the minutes.
        </p>

        <div className="field" style={{ maxWidth: 280, marginBottom: 14 }}>
          <label htmlFor="pomo-habit">Link to habit</label>
          <select id="pomo-habit" value={linkedId || ''} onChange={(e) => setLinkedId(e.target.value || null)}>
            <option value="">No habit linked</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        {linkedHabit && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: 14 }}>
            {linkedHabit.name}: <strong>{linkedMinutes}</strong> min tracked total
          </p>
        )}

        <div className="pomo-controls">
          <button className="btn btn-ember btn-sm" onClick={() => setRunning((r) => !r)}>
            {running ? 'Pause' : 'Start'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
