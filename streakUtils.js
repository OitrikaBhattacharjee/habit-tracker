import { todayKey, addDays } from './dateUtils';

function isCovered(checkins, freezes, key) {
  return Boolean(checkins[key]) || Boolean(freezes && freezes[key]);
}

// Counts backward from today. If today isn't checked yet, we start counting
// from yesterday so the streak doesn't drop to 0 just because the day isn't over.
export function calcCurrentStreak(checkins = {}, freezes = {}) {
  let streak = 0;
  let cursor = todayKey();
  if (!isCovered(checkins, freezes, cursor)) {
    cursor = addDays(cursor, -1);
  }
  while (isCovered(checkins, freezes, cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// Longest run of consecutive completed (or frozen) days in the whole history.
export function calcLongestStreak(checkins = {}, freezes = {}) {
  const keys = new Set([...Object.keys(checkins).filter((k) => checkins[k]), ...Object.keys(freezes || {})]);
  if (keys.size === 0) return 0;
  const sorted = [...keys].sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  for (const key of sorted) {
    if (prev && addDays(prev, 1) === key) {
      current += 1;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
    prev = key;
  }
  return longest;
}

export function calcCompletionRate(checkins = {}, days = 7) {
  let cursor = todayKey();
  let done = 0;
  for (let i = 0; i < days; i++) {
    if (checkins[cursor]) done++;
    cursor = addDays(cursor, -1);
  }
  return Math.round((done / days) * 100);
}

// "Habit Momentum" - recent days count more than older ones, using exponential
// decay, so a strong last week outweighs a mediocre month.
export function calcMomentum(checkins = {}, days = 30, decay = 0.88) {
  let cursor = todayKey();
  let weightedSum = 0;
  let weightTotal = 0;
  for (let i = 0; i < days; i++) {
    const weight = Math.pow(decay, i);
    weightTotal += weight;
    if (checkins[cursor]) weightedSum += weight;
    cursor = addDays(cursor, -1);
  }
  if (weightTotal === 0) return 0;
  return Math.round((weightedSum / weightTotal) * 100);
}

export function totalCheckins(checkins = {}) {
  return Object.values(checkins).filter(Boolean).length;
}
