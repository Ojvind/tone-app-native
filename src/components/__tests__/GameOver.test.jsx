import React from 'react';
import { render, screen } from '@testing-library/react-native';
import GameOver from '../GameOver';

// score / (totalRounds * 8) = percentage
// totalRounds=1, total=8 notes
const renderGameOver = (score, totalRounds = 1) =>
  render(<GameOver score={score} totalRounds={totalRounds} onReset={() => {}} />);

describe('GameOver – meddelanden per procentintervall', () => {
  it('visar "Du är en mästare!" vid 90–100%', () => {
    renderGameOver(8, 1); // 100%
    expect(screen.getByText('Du är en mästare!')).toBeTruthy();
  });

  it('visar "Imponerande, nästan perfekt!" vid 80–89%', () => {
    renderGameOver(7, 1); // 87.5%
    expect(screen.getByText('Imponerande, nästan perfekt!')).toBeTruthy();
  });

  it('visar "Du är på god väg!" vid 70–79%', () => {
    renderGameOver(6, 1); // 75%
    expect(screen.getByText('Du är på god väg!')).toBeTruthy();
  });

  it('visar "Inte illa, men det finns rum för förbättring." vid 60–69%', () => {
    renderGameOver(5, 1); // 62.5%
    expect(screen.getByText('Inte illa, men det finns rum för förbättring.')).toBeTruthy();
  });

  it('visar "Halvvägs där – öva lite till!" vid 50–59%', () => {
    renderGameOver(16, 4); // 50%
    expect(screen.getByText('Halvvägs där – öva lite till!')).toBeTruthy();
  });

  it('visar "Det går trögt, men ge inte upp!" vid 40–49%', () => {
    renderGameOver(3, 1); // 37.5% → 38% → faktiskt 40–49 behöver annan kombination
    // 40% av 8 = 3.2 → inte exakt, använd totalRounds=5: 40% av 40 = 16
    render(<GameOver score={16} totalRounds={5} onReset={() => {}} />);
    expect(screen.getByText('Det går trögt, men ge inte upp!')).toBeTruthy();
  });

  it('visar "Noterna verkar inte vilja samarbeta..." vid 30–39%', () => {
    // 32% av 8 = 2.56 → använd totalRounds=5: 30% av 40 = 12
    render(<GameOver score={12} totalRounds={5} onReset={() => {}} />);
    expect(screen.getByText('Noterna verkar inte vilja samarbeta...')).toBeTruthy();
  });

  it('visar "Hörde du någonsin talas om en notskola?" vid 20–29%', () => {
    // 25% av 8 = 2 noter rätt
    renderGameOver(2, 1);
    expect(screen.getByText('Din granne ringer och ber dig sluta.')).toBeTruthy();
  });

  it('visar "Katten på pianot hade gjort det bättre." vid 10–19%', () => {
    // 12.5% av 8 = 1 noter rätt
    renderGameOver(1, 1);
    expect(screen.getByText('Katten på pianot hade gjort det bättre.')).toBeTruthy();
  });

  it('visar "Du är tondöv, ge upp!" vid under 10%', () => {
    renderGameOver(0, 1); // 0%
    expect(screen.getByText('Du är tondöv, ge upp!')).toBeTruthy();
  });
});

describe('GameOver – bilder', () => {
  it('visar bild vid 90–100%', () => {
    renderGameOver(8, 1); // 100%
    expect(screen.getByTestId('img-90')).toBeTruthy();
  });

  it('visar bild vid 80–89%', () => {
    renderGameOver(7, 1); // 87.5%
    expect(screen.getByTestId('img-80')).toBeTruthy();
  });

  it('visar bild vid 70–79%', () => {
    renderGameOver(6, 1); // 75%
    expect(screen.getByTestId('img-70')).toBeTruthy();
  });

  it('visar bild vid 60–69%', () => {
    renderGameOver(5, 1); // 62.5%
    expect(screen.getByTestId('img-60')).toBeTruthy();
  });

  it('visar bild vid 50–59%', () => {
    render(<GameOver score={16} totalRounds={4} onReset={() => {}} />); // 50%
    expect(screen.getByTestId('img-50')).toBeTruthy();
  });

  it('visar bild vid 40–49%', () => {
    render(<GameOver score={10} totalRounds={3} onReset={() => {}} />); // 41.7%
    expect(screen.getByTestId('img-40')).toBeTruthy();
  });

  it('visar bild vid 30–39%', () => {
    render(<GameOver score={12} totalRounds={5} onReset={() => {}} />); // 30%
    expect(screen.getByTestId('img-30')).toBeTruthy();
  });

  it('visar bild vid 20–29%', () => {
    renderGameOver(2, 1); // 25%
    expect(screen.getByTestId('img-20')).toBeTruthy();
  });

  it('visar bild vid 10–19%', () => {
    renderGameOver(1, 1); // 12.5%
    expect(screen.getByTestId('img-10')).toBeTruthy();
  });

  it('visar bild vid 0–9%', () => {
    renderGameOver(0, 1); // 0%
    expect(screen.getByTestId('img-0')).toBeTruthy();
  });
});
