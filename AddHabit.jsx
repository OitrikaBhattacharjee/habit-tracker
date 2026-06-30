import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits, CATEGORIES, FREQUENCIES } from '../context/HabitsContext.jsx';
import { calcCurrentStreak } from '../utils/streakUtils.js';

const EMPTY_FORM = { name: '', category: '', frequency: '' };

export default function AddHabit() {
  const { habits, addHabit, editHabit, deleteHabit, freezesForHabit } = useHabits();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const errors = {
    name: form.name.trim().length === 0 ? 'Give your habit a name.' : null,
    category: form.category === '' ? 'Pick a category.' : null,
    frequency: form.frequency === '' ? 'Pick how often you\'ll do this.' : null,
  };

  const isValid = !errors.name && !errors.category && !errors.frequency;

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, category: true, frequency: true });
    if (!isValid) return;

    if (editingId) {
      editHabit(editingId, { name: form.name.trim(), category: form.category, frequency: form.frequency });
    } else {
      addHabit(form);
    }

    setSuccess(true);
    setForm(EMPTY_FORM);
    setTouched({});
    setEditingId(null);

    setTimeout(() => {
      navigate('/dashboard');
    }, 900);
  }

  function startEdit(habit) {
    setEditingId(habit.id);
    setForm({ name: habit.name, category: habit.category, frequency: habit.frequency });
    setTouched({});
    setSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTouched({});
  }

  return (
    <div className="container section">
      <h2>{editingId ? 'Edit habit' : 'Start a new habit'}</h2>
      <p style={{ marginBottom: 32 }}>
        Define what you're building. Name it, categorize it, and decide how often it counts as a win.
      </p>

      <div className="form-wrap card card-pad" style={{ marginBottom: 56 }}>
        {success && <div className="success-banner">Saved! Taking you to your dashboard…</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="habit-name">Habit name</label>
            <input
              id="habit-name"
              type="text"
              placeholder="e.g. Morning walk"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={touched.name && errors.name ? 'invalid' : ''}
            />
            {touched.name && errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="habit-category">Category</label>
            <select
              id="habit-category"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={touched.category && errors.category ? 'invalid' : ''}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {touched.category && errors.category && <div className="field-error">{errors.category}</div>}
          </div>

          <div className="field">
            <label htmlFor="habit-frequency">Frequency</label>
            <select
              id="habit-frequency"
              value={form.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              onBlur={() => handleBlur('frequency')}
              className={touched.frequency && errors.frequency ? 'invalid' : ''}
            >
              <option value="">Select a frequency…</option>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {touched.frequency && errors.frequency && <div className="field-error">{errors.frequency}</div>}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-ember" disabled={!isValid}>
              {editingId ? 'Save changes' : 'Add Habit'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Your habits</h3>
      {habits.length === 0 ? (
        <div className="empty-state">No habits yet — add your first one above to get started.</div>
      ) : (
        <div>
          {habits.map((h) => {
            const streak = calcCurrentStreak(h.checkins, freezesForHabit(h.id));
            return (
              <div className="habit-row" key={h.id}>
                <span className="color-dot" style={{ background: h.color }} />
                <div className="meta">
                  <div className="h-name">{h.name}</div>
                  <div className="h-sub">{h.category} · {h.frequency} · 🔥 {streak} day streak</div>
                </div>
                <button className="icon-btn" onClick={() => startEdit(h)}>Edit</button>
                <button
                  className="icon-btn danger"
                  onClick={() => {
                    if (confirm(`Delete "${h.name}"? This can't be undone.`)) deleteHabit(h.id);
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
