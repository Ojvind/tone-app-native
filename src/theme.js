import { useColorScheme } from 'react-native';

const light = {
  isDark: false,
  noteColor: '#2c1a0e',
  bg: '#faf6ed',
  card: '#fff8ee',
  text: '#2c1a0e',
  textSecondary: '#6b4c30',
  textMuted: '#9e7f5e',
  placeholder: '#b8956a',
  border: '#c8a87a',
  divider: '#d4b896',
  inputBg: '#fffdf5',
  buttonBg: '#5c3a1e',
  buttonText: '#faf6ed',
  stepBg: '#e8dcc8',
  correct: '#3d6e4e',
  correctBg: '#f0f7f2',
  wrong: '#8b3a3a',
  wrongBg: '#fdf2f2',
  webViewBg: '#fff8ee',
};

const dark = {
  isDark: true,
  noteColor: '#c8a87a',
  bg: '#111111',
  card: '#1e1e1e',
  text: '#f5f0e8',
  textSecondary: '#c8a87a',
  textMuted: '#7a6a55',
  placeholder: '#5a4a35',
  border: '#3a2e20',
  divider: '#2a2218',
  inputBg: '#191919',
  buttonBg: '#c8a87a',
  buttonText: '#111111',
  stepBg: '#272320',
  correct: '#5aaa78',
  correctBg: '#152518',
  wrong: '#d47070',
  wrongBg: '#251515',
  webViewBg: '#1e1e1e',
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}
