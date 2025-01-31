// src/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import WelcomeScreenStyles from '../styles/WelcomeScreenStyles'; // Importa los estilos de WelcomeScreen
import globalStyles from '../styles/globalStyles'; // Importa los estilos globales

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/background.jpg')} // Asegúrate de tener una imagen en la carpeta assets
      style={WelcomeScreenStyles.background}
    >
      <View style={WelcomeScreenStyles.overlay}>
        <Text style={WelcomeScreenStyles.title}>AIDrive</Text>
        <Text style={WelcomeScreenStyles.subtitle}>Bienvenido</Text>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={globalStyles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;