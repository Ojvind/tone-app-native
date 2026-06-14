import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../App';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('../src/premium', () => ({
  initPurchases: jest.fn(),
  usePremium: jest.fn(),
}));

jest.mock('../src/hooks/useGame', () => ({
  useGame: jest.fn(),
}));

jest.mock('../src/components/NoteDisplay', () => () => null);

jest.mock('../src/components/Stats', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, { testID: 'stats-content' });
});

jest.mock('../src/components/Paywall', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ onSuccess }) =>
    React.createElement(
      View,
      { testID: 'paywall-content' },
      React.createElement(Text, { testID: 'paywall-success', onPress: onSuccess }, 'Buy'),
    );
});

jest.mock('../src/stats', () => ({
  recordSession: jest.fn(),
  loadStats: jest.fn().mockResolvedValue(null),
}));

const makeGame = (stateOverrides = {}) => ({
  state: {
    notes: [],
    guesses: [],
    results: [],
    score: 0,
    round: 0,
    checked: false,
    totalRounds: 5,
    gameStarted: false,
    gameOver: false,
    difficulty: 'beginner',
    ...stateOverrides,
  },
  actions: {
    setGuesses: jest.fn(),
    setTotalRounds: jest.fn(),
    setDifficulty: jest.fn(),
    generateNotes: jest.fn(),
    checkAnswers: jest.fn(),
    handleNext: jest.fn(),
    startGame: jest.fn(),
    resetGame: jest.fn(),
  },
});

const makePremium = (overrides = {}) => ({
  isPremium: false,
  isLoading: false,
  priceString: '$4.99',
  purchase: jest.fn(),
  restore: jest.fn(),
  ...overrides,
});

// Bug: resetGame didn't reset difficulty. After a premium user played at 'advanced' and
// pressed "Play again", the difficulty stayed 'advanced' in state. A non-premium user
// could then press Start and bypass the paywall entirely, since startGame had no
// isPremium check. Fixed by wrapping startGame in handleStart() in App.js.
describe('handleStart – paywall gate for premium difficulties', () => {
  it('blocks non-premium user from starting a game with premium difficulty', () => {
    const { usePremium } = require('../src/premium');
    const { useGame } = require('../src/hooks/useGame');
    const game = makeGame({ difficulty: 'advanced' });
    usePremium.mockReturnValue(makePremium({ isPremium: false }));
    useGame.mockReturnValue(game);

    render(<App />);
    fireEvent.press(screen.getByText('Start practice'));

    expect(game.actions.startGame).not.toHaveBeenCalled();
    expect(screen.getByTestId('paywall-content')).toBeTruthy();
  });

  it('blocks non-premium user from starting with intermediate difficulty', () => {
    const { usePremium } = require('../src/premium');
    const { useGame } = require('../src/hooks/useGame');
    const game = makeGame({ difficulty: 'intermediate' });
    usePremium.mockReturnValue(makePremium({ isPremium: false }));
    useGame.mockReturnValue(game);

    render(<App />);
    fireEvent.press(screen.getByText('Start practice'));

    expect(game.actions.startGame).not.toHaveBeenCalled();
    expect(screen.getByTestId('paywall-content')).toBeTruthy();
  });

  it('allows premium user to start with advanced difficulty', () => {
    const { usePremium } = require('../src/premium');
    const { useGame } = require('../src/hooks/useGame');
    const game = makeGame({ difficulty: 'advanced' });
    usePremium.mockReturnValue(makePremium({ isPremium: true }));
    useGame.mockReturnValue(game);

    render(<App />);
    fireEvent.press(screen.getByText('Start practice'));

    expect(game.actions.startGame).toHaveBeenCalled();
  });

  it('allows non-premium user to start with beginner difficulty', () => {
    const { usePremium } = require('../src/premium');
    const { useGame } = require('../src/hooks/useGame');
    const game = makeGame({ difficulty: 'beginner' });
    usePremium.mockReturnValue(makePremium({ isPremium: false }));
    useGame.mockReturnValue(game);

    render(<App />);
    fireEvent.press(screen.getByText('Start practice'));

    expect(game.actions.startGame).toHaveBeenCalled();
  });
});

// Bug: the old Stats modal rendered {isPremium ? <Stats> : <Paywall>} inside the modal,
// providing a defence-in-depth guard. The refactor moved gating to handleStatsPress()
// but removed the in-modal guard. handlePaywallSuccess() calls setShowStats(true)
// immediately after purchase — before RevenueCat's async isPremium update propagates —
// so Stats could open while isPremium was still false. Fixed by adding
// {isPremium && <Stats>} inside the modal.
describe('Stats modal – isPremium guard', () => {
  it('does not render Stats content when isPremium is false after purchase', () => {
    const { usePremium } = require('../src/premium');
    const { useGame } = require('../src/hooks/useGame');
    usePremium.mockReturnValue(makePremium({ isPremium: false }));
    useGame.mockReturnValue(makeGame());

    render(<App />);

    // Stats button → opens paywall because isPremium is false
    fireEvent.press(screen.getByTestId('stats-btn'));
    expect(screen.getByTestId('paywall-content')).toBeTruthy();

    // Simulate purchase success — isPremium has NOT updated yet in state
    fireEvent.press(screen.getByTestId('paywall-success'));

    // showStats is now true but isPremium is still false — Stats must not render
    expect(screen.queryByTestId('stats-content')).toBeNull();
  });

  it('renders Stats content when isPremium is true', () => {
    const { usePremium } = require('../src/premium');
    const { useGame } = require('../src/hooks/useGame');
    usePremium.mockReturnValue(makePremium({ isPremium: true }));
    useGame.mockReturnValue(makeGame());

    render(<App />);

    fireEvent.press(screen.getByTestId('stats-btn'));

    expect(screen.getByTestId('stats-content')).toBeTruthy();
  });
});
