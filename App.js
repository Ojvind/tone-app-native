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
import Settings from './src/components/Settings';
import NoteDisplay from './src/components/NoteDisplay';
import GuessInput from './src/components/GuessInput';
import ScoreBoard from './src/components/ScoreBoard';
import GameOver from './src/components/GameOver';

export default function App() {
  const { state, actions } = useGame();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Guess the Notes</Text>

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
              <Pressable style={styles.button} onPress={actions.handleNext}>
                <Text style={styles.buttonText}>
                  {!state.checked
                    ? 'Check answers'
                    : state.round + 1 < state.totalRounds
                    ? 'Next'
                    : 'Show results'}
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
    backgroundColor: '#f8f8f8',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  game: {
    gap: 16,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
