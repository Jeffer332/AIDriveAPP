import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#2A1943', '#38303B', '#120A19']} className="flex-1 justify-center items-center">
      <View className="items-center justify-center px-5">
        {/* Imagen principal */}
        <View className="justify-center items-center -mb-12">
          <Image
            source={require('../../assets/car.png')}
            className="w-[350px] h-[350px] max-w-full" //Imagen del centro y manteniendo la calidad
            resizeMode="contain"
          />
        </View>

        {/* Textos de bienvenida */}
        <Text className="text-white text-2xl font-bold text-center mb-2">Conduce tus sueños</Text>
        <Text className="text-gray-400 text-lg text-center leading-6 mb-6">
          La manera más fácil de encontrar el auto que siempre has deseado.
        </Text>

        {/* Botón de continuar */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('AsistenteVirtual')} 
          className="w-16 h-16 bg-[#8A76B5] rounded-full items-center justify-center shadow-md"
          
        >
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;
