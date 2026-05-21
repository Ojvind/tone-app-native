import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n';
import { loadStats } from '../stats';

function formatNote(name) {
  if (name.length > 1 && name.slice(-1).toLowerCase() === 'b') {
    return name.slice(0, -1) + '♭';
  }
  return name.replace('#', '♯');
}

function StreakCard({ streak, colors, t }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.textMuted }]}>{t.streak}</Text>
      <Text style={[styles.streakNumber, { color: colors.buttonBg }]}>{streak.current}</Text>
      <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{t.streakDays}</Text>
    </View>
  );
}

function MissedNotes({ noteStats, colors, t }) {
  const sorted = Object.entries(noteStats)
    .filter(([, s]) => s.total >= 3)
    .map(([name, s]) => ({ name, pct: Math.round((s.correct / s.total) * 100), total: s.total }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 8);

  if (sorted.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.textMuted }]}>{t.missedNotes}</Text>
      <Text style={[styles.cardSub, { color: colors.textMuted }]}>{t.missedNotesSub}</Text>
      {sorted.map(({ name, pct, total }) => (
        <View key={name} style={styles.noteRow}>
          <Text style={[styles.noteName, { color: colors.text }]}>{formatNote(name)}</Text>
          <View style={[styles.barBg, { backgroundColor: colors.stepBg }]}>
            <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: pct >= 70 ? colors.correct : pct >= 40 ? colors.buttonBg : colors.wrong }]} />
          </View>
          <Text style={[styles.notePct, { color: colors.textSecondary }]}>{pct}%</Text>
        </View>
      ))}
    </View>
  );
}

function SessionHistory({ sessions, colors, t }) {
  if (sessions.length === 0) return null;
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.cardTitle, { color: colors.textMuted }]}>{t.history}</Text>
      {sessions.slice(0, 10).map((s, i) => (
        <View key={i} style={[styles.sessionRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.divider }]}>
          <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>{s.date}</Text>
          <Text style={[styles.sessionScore, { color: s.percentage >= 70 ? colors.correct : colors.text }]}>
            {s.percentage}%
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function Stats({ onClose }) {
  const colors = useTheme();
  const t = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadStats().then(setData);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t.statsTitle}</Text>
        <Pressable onPress={onClose}>
          <Text style={[styles.close, { color: colors.buttonBg }]}>{t.close}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {!data || data.sessions.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]}>{t.noStats}</Text>
        ) : (
          <>
            <StreakCard streak={data.streak} colors={colors} t={t} />
            <MissedNotes noteStats={data.noteStats} colors={colors} t={t} />
            <SessionHistory sessions={data.sessions} colors={colors} t={t} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 },
  close: { fontSize: 16, fontWeight: '600' },
  scroll: { padding: 20, gap: 16 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 15, fontStyle: 'italic' },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardSub: { fontSize: 13 },
  streakNumber: { fontSize: 56, fontWeight: 'bold', lineHeight: 60 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noteName: { width: 36, fontSize: 14, fontWeight: '600' },
  barBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  notePct: { width: 36, fontSize: 13, textAlign: 'right' },
  sessionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  sessionDate: { fontSize: 14 },
  sessionScore: { fontSize: 14, fontWeight: '600' },
});
