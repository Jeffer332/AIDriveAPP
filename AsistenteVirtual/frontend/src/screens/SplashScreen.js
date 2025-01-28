import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
  const navigateToChatBot = () => {
    navigation.navigate('ChatBot'); // Asegúrate de que el nombre de la pantalla sea correcto
  };

  return (
    <LinearGradient
      colors={['#2A1943', '#38303B', '#120A19']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Icono o imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/car.png')} // Ruta de la imagen
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Texto principal */}
        <Text style={styles.title}>Conduce tus sueños</Text>
        <Text style={styles.subtitle}>
          La manera más fácil de encontrar el auto que siempre has deseado.
        </Text>

        {/* Botón de continuar */}
        <TouchableOpacity style={styles.button} onPress={navigateToChatBot}>
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    justifyContent: 'center', // Centra verticalmente el contenedor
    alignItems: 'center',    // Centra horizontalmente el contenedor
    marginBottom: -50,        // Espacio entre la imagen y el texto
  },
  image: {
    width: 350,  // Imagen más grande
    height: 350, // Imagen más grande
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: '#8A76B5',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default SplashScreen;
