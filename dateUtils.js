// Dates are handled as "YYYY-MM-DD" strings in local time, not UTC.
// This avoids the off-by-one bugs you get from new Date(string) parsing as UTC.

export function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return toKey(new Date());
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const date = keyToDate(key);
  date.setDate(date.getDate() + n);
  return toKey(date);
}

// last n days including today, oldest first
export function lastNDates(n) {
  const out = [];
  let cursor = todayKey();
  for (let i = 0; i < n; i++) {
    out.unshift(cursor);
    cursor = addDays(cursor, -1);
  }
  return out;
}

// ISO week key like "2026-W27", used to reset the freeze token each week
export function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function formatPretty(key) {
  const date = keyToDate(key);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function isToday(key) {
  return key === todayKey();
}
