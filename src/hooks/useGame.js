import { useState } from 'react';
import { TREBLE_NOTES, BASS_NOTES } from '../constants';

export function useGame(initialRounds = 5) {
  const [notes, setNotes] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [checked, setChecked] = useState(false);
  const [totalRounds, setTotalRounds] = useState(initialRounds);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const generateNotes = () => {
    const trebleNotes = Array.from({ length: 4 }, () =>
      TREBLE_NOTES[Math.floor(Math.random() * TREBLE_NOTES.length)]
    ).map(note => ({ ...note, clef: 'treble' }));

    const bassNotes = Array.from({ length: 4 }, () =>
      BASS_NOTES[Math.floor(Math.random() * BASS_NOTES.length)]
    ).map(note => ({ ...note, clef: 'bass' }));

    const allNotes = [...trebleNotes, ...bassNotes];
    setNotes(allNotes);
    setGuesses(Array(allNotes.length).fill(''));
    setResults([]);
    setChecked(false);
    // Audio is played by NoteDisplay WebView when it receives the new notes
  };

  const checkAnswers = () => {
    const checkedResults = notes.map((note, i) => {
      const guess = guesses[i].trim().toUpperCase();
      return guess === note.name.toUpperCase();
    });
    const roundScore = checkedResults.filter(Boolean).length;
    setScore(prev => prev + roundScore);
    setResults(checkedResults);
    setChecked(true);
  };

  const handleNext = () => {
    if (!checked) {
      checkAnswers();
    } else if (round + 1 < totalRounds) {
      setRound(prev => prev + 1);
      generateNotes();
    } else {
      setGameOver(true);
    }
  };

  const startGame = () => {
    setScore(0);
    setRound(0);
    setGameOver(false);
    setGameStarted(true);
    generateNotes();
  };

  const resetGame = () => {
    setNotes([]);
    setGuesses([]);
    setResults([]);
    setScore(0);
    setRound(0);
    setChecked(false);
    setGameStarted(false);
    setGameOver(false);
  };

  return {
    state: {
      notes,
      guesses,
      results,
      score,
      round,
      checked,
      totalRounds,
      gameStarted,
      gameOver,
    },
    actions: {
      setGuesses,
      setTotalRounds,
      generateNotes,
      checkAnswers,
      handleNext,
      startGame,
      resetGame,
    },
  };
}
