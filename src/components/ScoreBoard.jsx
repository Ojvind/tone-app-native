import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function ScoreBoard({ round, totalRounds, score, checked }) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        <Text style={[styles.label, { color: colors.text }]}>Runda: </Text>
        {round + 1} / {totalRounds}
      </Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        <Text style={[styles.label, { color: colors.text }]}>Poäng: </Text>
        {score}
      </Text>
      {checked && round + 1 < totalRounds && (
        <Text style={[styles.hint, { color: colors.textMuted }]}>Tryck Nästa →</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
  },
  label: {
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
