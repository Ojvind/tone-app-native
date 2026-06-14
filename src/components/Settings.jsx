import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n';

export default function Settings({
  totalRounds,
  setTotalRounds,
  difficulty,
  setDifficulty,
  isPremium,
  onPremiumRequired,
  onStart,
}) {
  const colors = useTheme();
  const t = useTranslation();

  const DIFFICULTY_OPTIONS = [
    { key: 'beginner', label: t.difficultyBeginner, desc: t.difficultyBeginnerDesc, premium: false },
    { key: 'intermediate', label: t.difficultyIntermediate, desc: t.difficultyIntermediateDesc, premium: true },
    { key: 'advanced', label: t.difficultyAdvanced, desc: t.difficultyAdvancedDesc, premium: true },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{t.difficulty}</Text>
      <View style={styles.difficultyRow}>
        {DIFFICULTY_OPTIONS.map(({ key, label, desc, premium }) => {
          const locked = premium && !isPremium;
          const selected = difficulty === key;
          const textColor = selected ? colors.buttonText : locked ? colors.textMuted : colors.text;
          return (
            <Pressable
              key={key}
              style={[
                styles.diffPill,
                { borderColor: colors.border },
                selected
                  ? { backgroundColor: colors.buttonBg }
                  : { backgroundColor: colors.stepBg },
              ]}
              onPress={() => locked ? onPremiumRequired(key) : setDifficulty(key)}
            >
              <Text style={[styles.diffPillText, { color: textColor }]}>
                {locked ? '🔒 ' : ''}{label}
              </Text>
              <Text style={[styles.diffPillDesc, { color: textColor }]}>{desc}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, { color: colors.textMuted }]}>{t.numberOfRounds}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.stepButton, { backgroundColor: colors.stepBg, borderColor: colors.border }]}
          onPress={() => setTotalRounds(Math.max(1, totalRounds - 1))}
        >
          <Text style={[styles.stepButtonText, { color: colors.text }]}>−</Text>
        </Pressable>
        <Text style={[styles.roundsValue, { color: colors.text }]}>{totalRounds}</Text>
        <Pressable
          style={[styles.stepButton, { backgroundColor: colors.stepBg, borderColor: colors.border }]}
          onPress={() => setTotalRounds(Math.min(20, totalRounds + 1))}
        >
          <Text style={[styles.stepButtonText, { color: colors.text }]}>+</Text>
        </Pressable>
      </View>
      <Pressable
        style={[styles.startButton, { backgroundColor: colors.buttonBg }]}
        onPress={onStart}
      >
        <Text style={[styles.startButtonText, { color: colors.buttonText }]}>{t.startPractice}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  diffPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffPillText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  diffPillDesc: {
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    fontSize: 22,
    lineHeight: 26,
  },
  roundsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'center',
  },
  startButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
