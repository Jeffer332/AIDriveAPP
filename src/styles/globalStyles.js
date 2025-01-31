// src/styles/globalStyles.js
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default globalStyles;