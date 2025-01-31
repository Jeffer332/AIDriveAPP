// src/styles/WelcomeScreenStyles.js
import { StyleSheet } from 'react-native';

const WelcomeScreenStyles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Rectángulo negro con opacidad
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-condensed', // Cambia esto por la fuente que desees
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'sans-serif', // Cambia esto por la fuente que desees
  },
});

export default WelcomeScreenStyles;