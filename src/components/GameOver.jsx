import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

export default function GameOver({ score, totalRounds, onReset }) {
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
      <Text style={styles.title}>Spelet är slut!</Text>
      <Text style={styles.score}>
        Du fick <Text style={styles.bold}>{score}</Text> av{' '}
        <Text style={styles.bold}>{total}</Text> rätt.
      </Text>
      <Text style={styles.percentage}>{percentage}% rätt</Text>
      <Text style={styles.message}>{message}</Text>
      {percentage >= 90 && (
        <Image testID="img-90" source={require('../../assets/90-100-mozart-glasses.jpg')} style={styles.mozart} />
      )}
      {percentage >= 80 && percentage < 90 && (
        <Image testID="img-80" source={require('../../assets/80-89.lorin.maazel.jpg')} style={styles.mozart} />
      )}
      {percentage >= 70 && percentage < 80 && (
        <Image testID="img-70" source={require('../../assets/70-79.right.track.png')} style={styles.mozart} />
      )}
      {percentage >= 60 && percentage < 70 && (
        <Image testID="img-60" source={require('../../assets/60-69.follow.the.music.jpg')} style={styles.mozart} />
      )}
      {percentage >= 50 && percentage < 60 && (
        <Image testID="img-50" source={require('../../assets/50-59.musiker.i.trappa.jpg')} style={styles.mozart} />
      )}
      {percentage >= 40 && percentage < 50 && (
        <Image testID="img-40" source={require('../../assets/40-49.a.tired.musician.jpg')} style={styles.mozart} />
      )}
      {percentage >= 30 && percentage < 40 && (
        <Image testID="img-30" source={require('../../assets/30-39.lot.of.notes.jpg')} style={styles.mozart} />
      )}
      {percentage >= 20 && percentage < 30 && (
        <Image testID="img-20" source={require('../../assets/20-29-granne-spelar-hogt.png')} style={styles.mozart} />
      )}
      {percentage >= 10 && percentage < 20 && (
        <Image testID="img-10" source={require('../../assets/10-19-cat-piano.png')} style={styles.mozart} />
      )}
      {percentage < 10 && (
        <Image testID="img-0" source={require('../../assets/0-9-punkare-gitarr.jpg')} style={styles.mozart} />
      )}
      <Pressable style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Spela igen</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
  mozart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
