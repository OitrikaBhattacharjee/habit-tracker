import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadHabits, saveHabits, loadFreezeState, saveFreezeState } from '../utils/storage';
import { getWeekKey, todayKey, addDays } from '../utils/dateUtils';

const HabitsContext = createContext(null);

export const CATEGORIES = ['Health', 'Productivity', 'Mind', 'Custom'];
export const FREQUENCIES = ['Daily', 'Weekly', 'Custom'];
export const COLORS = ['#E8622C', '#5B7A5A', '#3E6B8A', '#B5582C', '#8A5BA0', '#C9A87C'];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function freshFreeze() {
  return { weekKey: getWeekKey(), available: true, frozenDates: {} };
}

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(() => loadHabits());
  const [freeze, setFreeze] = useState(() => {
    const existing = loadFreezeState();
    const currentWeek = getWeekKey();
    if (!existing || existing.weekKey !== currentWeek) {
      return freshFreeze();
    }
    return existing;
  });

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveFreezeState(freeze);
  }, [freeze]);

  // Re-check weekly reset on mount + every minute, in case the tab stays open across a week boundary.
  useEffect(() => {
    const check = () => {
      const currentWeek = getWeekKey();
      setFreeze((prev) => (prev.weekKey !== currentWeek ? freshFreeze() : prev));
    };
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);

  function addHabit({ name, category, frequency }) {
    const palette = COLORS[habits.length % COLORS.length];
    const newHabit = {
      id: uid(),
      name: name.trim(),
      category,
      frequency,
      color: palette,
      checkins: {},
      createdAt: todayKey(),
    };
    setHabits((prev) => [...prev, newHabit]);
    return newHabit.id;
  }

  function editHabit(id, updates) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  }

  function deleteHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function toggleCheckin(id, dateKey = todayKey()) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const checkins = { ...h.checkins };
        if (checkins[dateKey]) {
          delete checkins[dateKey];
        } else {
          checkins[dateKey] = true;
        }
        return { ...h, checkins };
      })
    );
  }

  // Spend the weekly freeze token to protect a specific habit's missed day.
  function spendFreeze(habitId, dateKey) {
    if (!freeze.available) return false;
    setFreeze((prev) => ({
      ...prev,
      available: false,
      frozenDates: { ...prev.frozenDates, [`${habitId}__${dateKey}`]: true },
    }));
    return true;
  }

  function freezesForHabit(habitId) {
    const out = {};
    Object.keys(freeze.frozenDates || {}).forEach((key) => {
      const [hId, dateKey] = key.split('__');
      if (hId === habitId) out[dateKey] = true;
    });
    return out;
  }

  const totalCheckinsAllTime = useMemo(
    () => habits.reduce((sum, h) => sum + Object.values(h.checkins).filter(Boolean).length, 0),
    [habits]
  );

  const yesterdayKey = addDays(todayKey(), -1);

  const value = {
    habits,
    addHabit,
    editHabit,
    deleteHabit,
    toggleCheckin,
    freeze,
    spendFreeze,
    freezesForHabit,
    totalCheckinsAllTime,
    yesterdayKey,
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider');
  return ctx;
}
