import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function GameOver({ score, totalRounds, onReset }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game over!</Text>
      <Text style={styles.score}>
        You scored <Text style={styles.bold}>{score}</Text> out of{' '}
        <Text style={styles.bold}>{totalRounds * 8}</Text>.
      </Text>
      <Pressable style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Play again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
