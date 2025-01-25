import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} // Imagen de fondo local
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image 
          source={require('../assets/logo.png')} // Ícono local
          style={styles.icon}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  icon: { width: 100, height: 100, marginBottom: 30 },
  button: { backgroundColor: 'red', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
