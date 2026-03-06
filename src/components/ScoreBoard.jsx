import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ScoreBoard({ round, totalRounds, score, checked }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.label}>Round: </Text>
        {round + 1} / {totalRounds}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Score: </Text>
        {score}
      </Text>
      {checked && (
        <Text style={styles.hint}>Press "Next" to continue.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
    gap: 4,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
