import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Settings({ totalRounds, setTotalRounds, onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Antal rundor</Text>
      <View style={styles.row}>
        <Pressable
          style={styles.stepButton}
          onPress={() => setTotalRounds(Math.max(1, totalRounds - 1))}
        >
          <Text style={styles.stepButtonText}>−</Text>
        </Pressable>
        <Text style={styles.roundsValue}>{totalRounds}</Text>
        <Pressable
          style={styles.stepButton}
          onPress={() => setTotalRounds(Math.min(20, totalRounds + 1))}
        >
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
      <Pressable style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>Starta övning</Text>
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
    color: '#9e7f5e',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
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
    backgroundColor: '#e8dcc8',
    borderWidth: 1,
    borderColor: '#c8a87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    fontSize: 22,
    color: '#2c1a0e',
    lineHeight: 26,
  },
  roundsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'center',
    color: '#2c1a0e',
  },
  startButton: {
    backgroundColor: '#5c3a1e',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#faf6ed',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
