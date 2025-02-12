// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Pantallas inicio de aplicación
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import DViewScreen from './src/screens/DView';
// Pantallas para el asistente virtual
import SplashScreen from './src/screens/SplashScreen';
import AsistenteVirtual from './src/screens/asistente_virtual';
import CameraScreen from './src/screens/CameraScreen'
import "./global.css";
import AutoDetectadoScreen from './src/screens/AutoDetectScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {/* Pantalla de Bienvenida */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        {/* Pantallas del Login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Pantallas Home */}
        <Stack.Screen name="DView" component={DViewScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Pantalla del Splash Screen */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {/* Pantalla del Asistente Virtual */}
        <Stack.Screen name="AsistenteVirtual" component={AsistenteVirtual} />
         {/* Pantalla de la cámara */}
         <Stack.Screen name="Camera" component={CameraScreen} />
         {/*Pantalla auto detectado*/}
         <Stack.Screen name="AutoDetectado" component={AutoDetectadoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;