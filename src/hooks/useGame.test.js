import { renderHook, act } from '@testing-library/react-native';
import { useGame } from './useGame';

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
