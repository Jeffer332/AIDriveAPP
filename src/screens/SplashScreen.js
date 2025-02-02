// src/screens/SplashScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
  return (
    <LinearGradient 
      colors={['#2A1943', '#38303B', '#120A19']} 
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
        

        {/* Imagen principal */}
        <Image
          source={require('../../assets/car.png')}
          style={{ width: 350, height: 350, maxWidth: '100%' }}
          resizeMode="contain"
        />

        {/* Textos de bienvenida */}
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          Conduce tus sueños
        </Text>
        <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          La manera más fácil de encontrar el auto que siempre has deseado.
        </Text>

        {/* Botón de continuar */}
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
          }}
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

