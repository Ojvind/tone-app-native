import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n';

function formatNoteName(name) {
  if (name.endsWith('#')) return name.slice(0, -1) + '♯';
  if (name.length === 2 && name.endsWith('b')) return name[0] + '♭';
  return name;
}

export default function GuessInput({ guesses, setGuesses, checked, results, notes }) {
  const colors = useTheme();
  const t = useTranslation();

  const handleChange = (index, value) => {
    const updated = [...guesses];
    updated[index] = value;
    setGuesses(updated);
  };

  const renderGroup = (label, indices) => (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={styles.row}>
        {indices.map(i => (
          <View key={i} style={styles.cell}>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text },
                checked && (results[i]
                  ? { borderColor: colors.correct, backgroundColor: colors.correctBg }
                  : { borderColor: colors.wrong, backgroundColor: colors.wrongBg }
                ),
              ]}
              value={guesses[i] ?? ''}
              onChangeText={value => handleChange(i, value)}
              editable={!checked}
              placeholder={t.placeholder}
              placeholderTextColor={colors.placeholder}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {checked && (
              <Text style={[styles.result, { color: results[i] ? colors.correct : colors.wrong }]}>
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
      {renderGroup(t.trebleClef, [0, 1, 2, 3])}
      {renderGroup(t.bassClef, [4, 5, 6, 7])}
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
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  cell: {
    alignItems: 'center',
    gap: 3,
  },
  input: {
    width: 72,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 15,
    textAlign: 'center',
  },
  result: {
    fontSize: 12,
    fontWeight: '600',
  },
});
