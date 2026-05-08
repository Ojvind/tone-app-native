import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ScoreBoard({ round, totalRounds, score, checked }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.label}>Runda: </Text>
        {round + 1} / {totalRounds}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Poäng: </Text>
        {score}
      </Text>
      {checked && round + 1 < totalRounds && (
        <Text style={styles.hint}>Tryck Nästa →</Text>
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
    backgroundColor: '#fff8ee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4b896',
  },
  text: {
    fontSize: 14,
    color: '#6b4c30',
  },
  label: {
    fontWeight: '700',
    color: '#2c1a0e',
  },
  hint: {
    fontSize: 12,
    color: '#9e7f5e',
    fontStyle: 'italic',
  },
});
