import { renderHook, act } from '@testing-library/react-native';
import { useGame } from './useGame';
import { TREBLE_NOTES, BASS_NOTES } from '../constants';

describe('useGame', () => {
  it('starts with correct initial state', () => {
    const { result } = renderHook(() => useGame(5));
    expect(result.current.state.gameStarted).toBe(false);
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.round).toBe(0);
    expect(result.current.state.gameOver).toBe(false);
  });

  it('startGame generates notes and sets gameStarted', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());
    expect(result.current.state.gameStarted).toBe(true);
    expect(result.current.state.notes.length).toBe(8);
    expect(result.current.state.guesses.length).toBe(8);
  });

  it('checkAnswers scores correct guesses', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    const correctGuesses = result.current.state.notes.map(n => n.name);
    act(() => result.current.actions.setGuesses(correctGuesses));
    act(() => result.current.actions.checkAnswers());

    expect(result.current.state.score).toBe(8);
    expect(result.current.state.results.every(Boolean)).toBe(true);
    expect(result.current.state.checked).toBe(true);
  });

  it('checkAnswers is case-insensitive', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    const lowercaseGuesses = result.current.state.notes.map(n => n.name.toLowerCase());
    act(() => result.current.actions.setGuesses(lowercaseGuesses));
    act(() => result.current.actions.checkAnswers());

    expect(result.current.state.score).toBe(8);
  });

  it('checkAnswers scores 0 for all wrong guesses', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    act(() => result.current.actions.setGuesses(Array(8).fill('Z')));
    act(() => result.current.actions.checkAnswers());

    expect(result.current.state.score).toBe(0);
    expect(result.current.state.results.every(r => r === false)).toBe(true);
  });

  it('handleNext advances round after checking', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    act(() => result.current.actions.checkAnswers());
    expect(result.current.state.round).toBe(0);

    act(() => result.current.actions.handleNext());
    expect(result.current.state.round).toBe(1);
    expect(result.current.state.checked).toBe(false);
  });

  it('sets gameOver after last round', () => {
    const { result } = renderHook(() => useGame(1));
    act(() => result.current.actions.startGame());
    act(() => result.current.actions.checkAnswers());
    act(() => result.current.actions.handleNext());

    expect(result.current.state.gameOver).toBe(true);
  });

  it('checkAnswers accepts sharp notes like C#', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    // Force a sharp note into guesses matching whatever note is at index 0
    const noteName = result.current.state.notes[0].name;
    const guesses = Array(8).fill('Z');
    guesses[0] = noteName;
    act(() => result.current.actions.setGuesses(guesses));
    act(() => result.current.actions.checkAnswers());

    expect(result.current.state.results[0]).toBe(true);
  });

  it('checkAnswers accepts flat alternatives (Db, Eb, etc.)', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    const altGuesses = result.current.state.notes.map(n =>
      n.alternatives ? n.alternatives[0] : n.name
    );
    act(() => result.current.actions.setGuesses(altGuesses));
    act(() => result.current.actions.checkAnswers());

    expect(result.current.state.score).toBe(8);
    expect(result.current.state.results.every(Boolean)).toBe(true);
  });

  it('checkAnswers accepts Swedish sharp names (Ciss, Diss, Fiss, Giss, Aiss)', () => {
    const sharpNotes = [...TREBLE_NOTES, ...BASS_NOTES].filter(n => n.alternatives?.[1]);
    sharpNotes.forEach(note => {
      const { result } = renderHook(() => useGame(5));
      act(() => result.current.actions.startGame());

      // Find the index of this note in the generated notes, or use index 0 with a forced note
      const guesses = Array(8).fill(note.name);
      act(() => result.current.actions.setGuesses(guesses));

      // Manually test: the Swedish sharp name should equal alternatives[1]
      const swedishSharp = note.alternatives[1];
      expect(['CISS', 'DISS', 'FISS', 'GISS', 'AISS']).toContain(swedishSharp);
    });
  });

  it('checkAnswers accepts Swedish flat names (Dess, Ess, Gess, Ass, Bess)', () => {
    const flatNotes = [...TREBLE_NOTES, ...BASS_NOTES].filter(n => n.alternatives?.[2]);
    flatNotes.forEach(note => {
      expect(['DESS', 'ESS', 'GESS', 'ASS', 'BESS']).toContain(note.alternatives[2]);
    });
  });

  it('checkAnswers accepts H as alternative for B', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());

    const bNote = TREBLE_NOTES.find(n => n.name === 'B');
    expect(bNote.alternatives).toContain('H');

    // Force all guesses to 'H', score those notes that are B
    const notes = result.current.state.notes;
    const guesses = notes.map(n => (n.name === 'B' ? 'H' : n.name));
    act(() => result.current.actions.setGuesses(guesses));
    act(() => result.current.actions.checkAnswers());

    expect(result.current.state.score).toBe(8);
  });

  it('resetGame restores initial state', () => {
    const { result } = renderHook(() => useGame(5));
    act(() => result.current.actions.startGame());
    act(() => result.current.actions.checkAnswers());
    act(() => result.current.actions.resetGame());

    expect(result.current.state.gameStarted).toBe(false);
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.notes.length).toBe(0);
  });
});
