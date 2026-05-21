import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme';
import { useTranslation } from '../i18n';

export default function GameOver({ score, totalRounds, onReset }) {
  const colors = useTheme();
  const t = useTranslation();
  const total = totalRounds * 8;
  const percentage = Math.round((score / total) * 100);
  const messageIndex = Math.min(Math.floor(percentage / 10), 9);
  const message = t.messages[messageIndex];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t.gameOver}</Text>
      <Text style={[styles.score, { color: colors.textSecondary }]}>{t.youGot(score, total)}</Text>
      <Text style={[styles.percentage, { color: colors.buttonBg }]}>{t.percentCorrect(percentage)}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {percentage >= 90 && (
        <Image testID="img-90" source={require('../../assets/90-100-mozart-glasses.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 80 && percentage < 90 && (
        <Image testID="img-80" source={require('../../assets/80-89.lorin.maazel.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 70 && percentage < 80 && (
        <Image testID="img-70" source={require('../../assets/70-79.right.track.png')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 60 && percentage < 70 && (
        <Image testID="img-60" source={require('../../assets/60-69.follow.the.music.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 50 && percentage < 60 && (
        <Image testID="img-50" source={require('../../assets/50-59.musiker.i.trappa.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 40 && percentage < 50 && (
        <Image testID="img-40" source={require('../../assets/40-49.a.tired.musician.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 30 && percentage < 40 && (
        <Image testID="img-30" source={require('../../assets/30-39.lot.of.notes.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 20 && percentage < 30 && (
        <Image testID="img-20" source={require('../../assets/20-29-granne-spelar-hogt.png')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage >= 10 && percentage < 20 && (
        <Image testID="img-10" source={require('../../assets/10-19-cat-piano.png')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      {percentage < 10 && (
        <Image testID="img-0" source={require('../../assets/0-9-punkare-gitarr.jpg')} style={[styles.mozart, { borderColor: colors.border }]} />
      )}
      <Pressable style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={onReset}>
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>{t.playAgainButton}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  score: {
    fontSize: 16,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  message: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  mozart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 8,
    borderWidth: 3,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
