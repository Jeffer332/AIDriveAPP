import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  return (
    <LinearGradient 
      colors={['#2A1943', '#38303B', '#120A19']} 
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20 }}>

        {/* Contenedor de la imagen */}
        <View style={{ width: width, height: height * 0.9, justifyContent: 'center', alignItems: 'center', marginTop: height * 0.07 }}>
          <Image
            source={require('../../assets/car.png')}
            style={{ width: width * 0.8, maxWidth: 500, height: '100%', resizeMode: 'contain' }}
          />
        </View>

        {/* Textos de bienvenida - Subidos hacia la imagen */}
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 30, marginTop: -300 }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
            Conduce tus sueños
          </Text>
          <Text style={{ color: '#aaa', fontSize: 14, textAlign: 'center', paddingHorizontal: 8 }}>
            La manera más fácil de encontrar el auto que siempre has deseado.
          </Text>
        </View>

        {/* Botón de continuar - Subido un poco */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('AsistenteVirtual')} 
          style={{
            width: 64,
            height: 64,
            backgroundColor: '#8A76B5',
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            marginBottom: 100,  // Reducimos el espacio para subir el botón
            marginTop: -10,  // Levantamos el botón
          }}
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>

      </View>
      <Footer activeScreen="SplashScreen" navigation={navigation} />
    </LinearGradient>
  );
};

export default SplashScreen;
