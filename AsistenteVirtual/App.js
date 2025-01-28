import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar pantallas
import SplashScreen from './frontend/src/screens/SplashScreen';
import AsistenteVirtual from './frontend/src/screens/asistente_virtual';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Pantalla Splash_AsistenteVirtual */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {/* Pantalla del Asistente Virtual */}
        <Stack.Screen name="ChatBot" component={AsistenteVirtual} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

