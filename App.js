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
          <Text style={styles.title}>Gissa noter</Text>
          <View style={styles.divider} />

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
    backgroundColor: '#faf6ed',
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
    color: '#2c1a0e',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#d4b896',
    marginBottom: 20,
  },
  game: {
    gap: 16,
  },
  button: {
    backgroundColor: '#5c3a1e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#faf6ed',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
