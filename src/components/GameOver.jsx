import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme';

export default function GameOver({ score, totalRounds, onReset }) {
  const colors = useTheme();
  const total = totalRounds * 8;
  const percentage = Math.round((score / total) * 100);

  let message;
  if (percentage >= 90) message = 'Du är en mästare!';
  else if (percentage >= 80) message = 'Imponerande, nästan perfekt!';
  else if (percentage >= 70) message = 'Du är på god väg!';
  else if (percentage >= 60) message = 'Inte illa, men det finns rum för förbättring.';
  else if (percentage >= 50) message = 'Halvvägs där – öva lite till!';
  else if (percentage >= 40) message = 'Det går trögt, men ge inte upp!';
  else if (percentage >= 30) message = 'Noterna verkar inte vilja samarbeta...';
  else if (percentage >= 20) message = 'Din granne ringer och ber dig sluta.';
  else if (percentage >= 10) message = 'Katten på pianot hade gjort det bättre.';
  else message = 'Du är tondöv, ge upp!';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Spelet är slut!</Text>
      <Text style={[styles.score, { color: colors.textSecondary }]}>
        Du fick <Text style={[styles.bold, { color: colors.text }]}>{score}</Text> av{' '}
        <Text style={[styles.bold, { color: colors.text }]}>{total}</Text> rätt.
      </Text>
      <Text style={[styles.percentage, { color: colors.buttonBg }]}>{percentage}% rätt</Text>
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
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>Spela igen</Text>
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
