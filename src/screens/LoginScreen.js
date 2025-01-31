// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginScreenStyles from '../styles/LoginScreenStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={LoginScreenStyles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={{ height: '50%', width: '100%' }} // Cambia el tamaño de la imagen de fondo a 50%
      >
        <View style={LoginScreenStyles.container}>
          <Image source={require('../../assets/logo2.png')} style={LoginScreenStyles.logo} />
          
          <View style={LoginScreenStyles.buttonContainer}>
            <TouchableOpacity style={LoginScreenStyles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={LoginScreenStyles.buttonText}>Ingreso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={LoginScreenStyles.button2} onPress={() => navigation.navigate('Register')}>
              <Text style={LoginScreenStyles.buttonText}>Registro</Text>
            </TouchableOpacity>
          </View>

          <View style={LoginScreenStyles.formContainer}>
            <TextInput
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              style={LoginScreenStyles.input}
            />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={LoginScreenStyles.input}
            />
            <TouchableOpacity style={LoginScreenStyles.button} onPress={handleLogin}>
              <Text style={LoginScreenStyles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;