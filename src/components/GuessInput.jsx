import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function GuessInput({ guesses, setGuesses, checked, results, notes }) {
  const handleChange = (index, value) => {
    const updated = [...guesses];
    updated[index] = value;
    setGuesses(updated);
  };

  const renderGroup = (label, indices) => (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.row}>
        {indices.map(i => (
          <View key={i} style={styles.cell}>
            <TextInput
              style={[
                styles.input,
                checked && (results[i] ? styles.inputCorrect : styles.inputWrong),
              ]}
              value={guesses[i] ?? ''}
              onChangeText={value => handleChange(i, value)}
              editable={!checked}
              placeholder="e.g. C"
              placeholderTextColor="#aaa"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {checked && (
              <Text style={[styles.result, results[i] ? styles.correct : styles.wrong]}>
                {results[i] ? '✓' : `✗ ${notes[i].name}`}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderGroup('Treble clef', [0, 1, 2, 3])}
      {renderGroup('Bass clef', [4, 5, 6, 7])}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  group: {
    gap: 4,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    alignItems: 'center',
    gap: 2,
  },
  input: {
    width: 72,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  inputCorrect: {
    borderColor: '#4caf50',
    backgroundColor: '#f0fff0',
  },
  inputWrong: {
    borderColor: '#f44336',
    backgroundColor: '#fff0f0',
  },
  result: {
    fontSize: 12,
    fontWeight: '600',
  },
  correct: {
    color: '#4caf50',
  },
  wrong: {
    color: '#f44336',
  },
});
