import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGame } from './src/hooks/useGame';
import { useTheme } from './src/theme';
import Settings from './src/components/Settings';
import NoteDisplay from './src/components/NoteDisplay';
import GuessInput from './src/components/GuessInput';
import ScoreBoard from './src/components/ScoreBoard';
import GameOver from './src/components/GameOver';

export default function App() {
  const { state, actions } = useGame();
  const colors = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.text }]}>Gissa noter</Text>
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
                    ? 'Kontrollera svar'
                    : state.round + 1 < state.totalRounds
                    ? 'Nästa'
                    : 'Visa resultat'}
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
});
