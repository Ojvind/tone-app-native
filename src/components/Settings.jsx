import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Settings({ totalRounds, setTotalRounds, onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Number of rounds</Text>
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
        <Text style={styles.startButtonText}>Start practice</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    fontSize: 20,
    color: '#333',
    lineHeight: 24,
  },
  roundsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 32,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
