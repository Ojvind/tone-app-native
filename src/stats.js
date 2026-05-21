import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'gissa_noter_stats';

const defaultStats = {
  sessions: [],
  noteStats: {},
  streak: { current: 0, lastDate: null },
};

export async function loadStats() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultStats;
  } catch {
    return defaultStats;
  }
}

async function saveStats(stats) {
  await AsyncStorage.setItem(KEY, JSON.stringify(stats));
}

export async function recordSession({ score, total, notes, results }) {
  const stats = await loadStats();
  const today = new Date().toISOString().slice(0, 10);

  // Session history (keep last 30)
  stats.sessions = [
    { date: today, score, total, percentage: Math.round((score / total) * 100) },
    ...stats.sessions,
  ].slice(0, 30);

  // Per-note accuracy
  notes.forEach((note, i) => {
    const name = note.name;
    if (!stats.noteStats[name]) stats.noteStats[name] = { correct: 0, total: 0 };
    stats.noteStats[name].total += 1;
    if (results[i]) stats.noteStats[name].correct += 1;
  });

  // Streak
  const last = stats.streak.lastDate;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (last === today) {
    // already practiced today, no change
  } else if (last === yesterday) {
    stats.streak.current += 1;
    stats.streak.lastDate = today;
  } else {
    stats.streak.current = 1;
    stats.streak.lastDate = today;
  }

  await saveStats(stats);
}
