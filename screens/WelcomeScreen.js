import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} // Imagen de fondo local
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Texto "AIDrive" en grande */}
        <Text style={styles.logo}>AIDrive</Text>
        {/* Texto "Bienvenido" debajo */}
        <Text style={styles.welcomeText}>Bienvenido</Text>
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
  logo: { 
    fontSize: 80, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 10,
    fontFamily: 'PlaywriteIndia', // Cambiar la fuente si deseas usar una tipografía moderna (asegúrate de cargarla correctamente)
  },
  welcomeText: { 
    fontSize: 20, 
    color: 'white', 
    marginBottom: 30 
  },
  button: { 
    backgroundColor: 'red', 
    paddingVertical: 15, 
    paddingHorizontal: 50, 
    borderRadius: 30 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
