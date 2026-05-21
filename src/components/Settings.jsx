import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n';

export default function Settings({ totalRounds, setTotalRounds, onStart }) {
  const colors = useTheme();
  const t = useTranslation();

  return (
    <View style={styles.container}>
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
