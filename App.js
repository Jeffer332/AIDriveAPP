// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Pantallas inicio de aplicación
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import NextScreen from './src/screens/NextScreen';
import HomeScreen from './src/screens/HomeScreen';
// Pantallas para el asistente virtual
import SplashScreen from './src/screens/SplashScreen';
import AsistenteVirtual from './src/screens/asistente_virtual';
import "./global.css";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Pantalla de Bienvenida */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        {/* Pantallas del Login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Pantallas Home */}
        <Stack.Screen name="NextScreen" component={NextScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Pantalla del Splash Screen */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {/* Pantalla del Asistente Virtual */}
        <Stack.Screen name="AsistenteVirtual" component={AsistenteVirtual} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;