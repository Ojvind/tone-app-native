import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from './src/hooks/useGame';
import { useTheme } from './src/theme';
import { useTranslation } from './src/i18n';
import Settings from './src/components/Settings';
import NoteDisplay from './src/components/NoteDisplay';
import GuessInput from './src/components/GuessInput';
import ScoreBoard from './src/components/ScoreBoard';
import GameOver from './src/components/GameOver';
import Stats from './src/components/Stats';
import Paywall from './src/components/Paywall';
import { initPurchases, usePremium } from './src/premium';

function StatsIcon({ color }) {
  const bars = [{ h: 8 }, { h: 18 }, { h: 13 }];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 20, paddingHorizontal: 2 }}>
      {bars.map((b, i) => (
        <View key={i} style={{ width: 5, height: b.h, borderRadius: 2, backgroundColor: color }} />
      ))}
    </View>
  );
}

function ClefDecorations({ color }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Text style={{ position: 'absolute', top: '48%', right: 40, fontSize: 260, lineHeight: 280, color, opacity: 0.06, transform: [{ rotate: '-12deg' }] }}>{'𝄞'}</Text>
      <Text style={{ position: 'absolute', top: '43%', left: 55, fontSize: 60, color, opacity: 0.08, transform: [{ rotate: '-8deg' }] }}>{'♩'}</Text>
      <Text style={{ position: 'absolute', top: '48%', left: 115, fontSize: 48, color, opacity: 0.07, transform: [{ rotate: '6deg' }] }}>{'♫'}</Text>
      <Text style={{ position: 'absolute', top: '54%', left: 72, fontSize: 40, color, opacity: 0.07, transform: [{ rotate: '-14deg' }] }}>{'♪'}</Text>
      <Text style={{ position: 'absolute', top: '47%', left: 160, fontSize: 52, color, opacity: 0.06, transform: [{ rotate: '10deg' }] }}>{'♬'}</Text>
      <Text style={{ position: 'absolute', bottom: '5%', left: 30, fontSize: 160, lineHeight: 180, color, opacity: 0.06, transform: [{ rotate: '10deg' }] }}>{'𝄢'}</Text>
    </View>
  );
}

export default function App() {
  const { state, actions } = useGame();
  const colors = useTheme();
  const t = useTranslation();
  const [showStats, setShowStats] = useState(false);
  const { isPremium, isLoading, priceString, purchase, restore } = usePremium();

  useEffect(() => { initPurchases(); }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {!state.gameStarted && <ClefDecorations color={colors.text} />}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>{t.title}</Text>
            {!state.gameStarted && (
              <Pressable onPress={() => setShowStats(true)} style={styles.statsButton}>
                <StatsIcon color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {!state.gameStarted && (
            <Settings
              totalRounds={state.totalRounds}
              setTotalRounds={actions.setTotalRounds}
              onStart={actions.startGame}
            />
          )}

          {state.gameStarted && !state.gameOver && (
            <View style={styles.game}>
              <ScoreBoard
                round={state.round}
                totalRounds={state.totalRounds}
                score={state.score}
                checked={state.checked}
              />
              <NoteDisplay notes={state.notes} />
              <GuessInput
                guesses={state.guesses}
                setGuesses={actions.setGuesses}
                checked={state.checked}
                results={state.results}
                notes={state.notes}
              />
              <Pressable
                style={[styles.button, { backgroundColor: colors.buttonBg }]}
                onPress={actions.handleNext}
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                  {!state.checked
                    ? t.checkAnswers
                    : state.round + 1 < state.totalRounds
                    ? t.next
                    : t.showResults}
                </Text>
              </Pressable>
            </View>
          )}

          {state.gameOver && (
            <GameOver
              score={state.score}
              totalRounds={state.totalRounds}
              onReset={actions.resetGame}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={showStats} animationType="slide">
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
          {isPremium
            ? <Stats onClose={() => setShowStats(false)} />
            : <Paywall
                onClose={() => setShowStats(false)}
                onSuccess={() => {}}
                priceString={priceString}
                isLoading={isLoading}
                purchase={purchase}
                restore={restore}
              />
          }
        </SafeAreaView>
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  game: {
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statsButton: {
    position: 'absolute',
    right: 0,
  },
});
