const HABITS_KEY = 'ember.habits.v1';
const FREEZE_KEY = 'ember.freeze.v1';
const POMODORO_KEY = 'ember.pomodoro.v1';

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadFreezeState() {
  try {
    const raw = localStorage.getItem(FREEZE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveFreezeState(state) {
  localStorage.setItem(FREEZE_KEY, JSON.stringify(state));
}

export function loadPomodoroMinutes() {
  try {
    const raw = localStorage.getItem(POMODORO_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePomodoroMinutes(minutesByHabit) {
  localStorage.setItem(POMODORO_KEY, JSON.stringify(minutesByHabit));
}
