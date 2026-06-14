import { useState, useRef, useCallback } from 'react';
import { TREBLE_NOTES, BASS_NOTES } from '../constants';
import { recordSession } from '../stats';

const SHARP_TO_FLAT = {
  'C#': { name: 'Db', keyPrefix: 'db' },
  'D#': { name: 'Eb', keyPrefix: 'eb' },
  'F#': { name: 'Gb', keyPrefix: 'gb' },
  'G#': { name: 'Ab', keyPrefix: 'ab' },
  'A#': { name: 'Bb', keyPrefix: 'bb' },
};

function maybeConvertToFlat(note) {
  const flat = SHARP_TO_FLAT[note.name];
  if (!flat || Math.random() < 0.5) return note;
  const octave = note.key.split('/')[1];
  const otherAlts = (note.alternatives ?? []).filter(a => a !== flat.name.toUpperCase());
  return {
    ...note,
    name: flat.name,
    key: `${flat.keyPrefix}/${octave}`,
    alternatives: [note.name, ...otherAlts],
  };
}

function filterByDifficulty(notes, difficulty) {
  if (difficulty === 'advanced') return notes;
  if (difficulty === 'intermediate') return notes.filter(n => n.difficulty === 'beginner' || n.difficulty === 'intermediate');
  return notes.filter(n => n.difficulty === 'beginner');
}

function pickUnique(arr, count) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

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
  const [difficulty, _setDifficulty] = useState('beginner');
  const difficultyRef = useRef('beginner');
  const setDifficulty = useCallback((d) => {
    difficultyRef.current = d;
    _setDifficulty(d);
  }, []);

  const allNotesRef = useRef([]);
  const allResultsRef = useRef([]);

  const generateNotes = () => {
    const treblePool = filterByDifficulty(TREBLE_NOTES, difficultyRef.current);
    const bassPool = filterByDifficulty(BASS_NOTES, difficultyRef.current);

    const trebleNotes = pickUnique(treblePool, 4)
      .map(note => ({ ...maybeConvertToFlat(note), clef: 'treble' }));

    const bassNotes = pickUnique(bassPool, 4)
      .map(note => ({ ...maybeConvertToFlat(note), clef: 'bass' }));

    const allNotes = [...trebleNotes, ...bassNotes];
    setNotes(allNotes);
    setGuesses(Array(allNotes.length).fill(''));
    setResults([]);
    setChecked(false);
  };

  const checkAnswers = () => {
    const checkedResults = notes.map((note, i) => {
      const guess = guesses[i].trim().toUpperCase();
      const accepted = [note.name.toUpperCase(), ...(note.alternatives ?? [])];
      return accepted.includes(guess);
    });
    const roundScore = checkedResults.filter(Boolean).length;
    setScore(prev => prev + roundScore);
    setResults(checkedResults);
    setChecked(true);
    allNotesRef.current = [...allNotesRef.current, ...notes];
    allResultsRef.current = [...allResultsRef.current, ...checkedResults];
  };

  const handleNext = () => {
    if (!checked) {
      checkAnswers();
    } else if (round + 1 < totalRounds) {
      setRound(prev => prev + 1);
      generateNotes();
    } else {
      const total = totalRounds * 8;
      recordSession({ score, total, notes: allNotesRef.current, results: allResultsRef.current });
      setGameOver(true);
    }
  };

  const startGame = () => {
    setScore(0);
    setRound(0);
    setGameOver(false);
    setGameStarted(true);
    allNotesRef.current = [];
    allResultsRef.current = [];
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
      difficulty,
    },
    actions: {
      setGuesses,
      setTotalRounds,
      setDifficulty,
      generateNotes,
      checkAnswers,
      handleNext,
      startGame,
      resetGame,
    },
  };
}
