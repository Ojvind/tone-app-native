import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

function formatNoteName(name) {
  if (name.endsWith('#')) return name.slice(0, -1) + '♯';
  if (name.length === 2 && name.endsWith('b')) return name[0] + '♭';
  return name;
}

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
                {results[i] ? '✓' : `✗ ${formatNoteName(notes[i].name)}`}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderGroup('G-nyckel', [0, 1, 2, 3])}
      {renderGroup('F-nyckel', [4, 5, 6, 7])}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  group: {
    gap: 6,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9e7f5e',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    alignItems: 'center',
    gap: 3,
  },
  input: {
    width: 72,
    borderWidth: 1.5,
    borderColor: '#c8a87a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#fffdf5',
    color: '#2c1a0e',
  },
  inputCorrect: {
    borderColor: '#3d6e4e',
    backgroundColor: '#f0f7f2',
  },
  inputWrong: {
    borderColor: '#8b3a3a',
    backgroundColor: '#fdf2f2',
  },
  result: {
    fontSize: 12,
    fontWeight: '600',
  },
  correct: {
    color: '#3d6e4e',
  },
  wrong: {
    color: '#8b3a3a',
  },
});
