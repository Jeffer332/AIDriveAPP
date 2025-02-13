// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginScreenStyles from '../styles/LoginScreenStyles';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estado para mostrar un indicador de carga mientras se procesa el inicio de sesión
  const [loading, setLoading] = useState(false);

  // Estado para manejar y mostrar los mensajes de error en la interfaz
  const [errorMessage, setErrorMessage] = useState('');

  // Inicializar Firestore
  const db = getFirestore();

  // Función para validar si el correo tiene un formato válido
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos electrónicos
    return emailRegex.test(email);
  };

  // Función que maneja el inicio de sesión del usuario
  const handleLogin = async () => {
    setErrorMessage(''); // Limpiar mensajes de error antes de la validación

    // Verificar que los campos no estén vacíos
    if ([email, password].some(field => !field?.trim())) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }
    
    /*if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }*/

    // Validar el formato del correo
    const validateEmail = (email) => {
      if (!email?.trim()) return "Por favor, introduce un correo electrónico.";
      if (!isValidEmail(email)) return "Por favor, introduce un correo válido.";
      return null; // No hay error
    };
    
    // Uso
    const errorMessage = validateEmail(email);
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }
    
    /*if (!isValidEmail(email)) {
      setErrorMessage("Por favor, introduce un correo válido.");
      return;
    }*/

    setLoading(true); // Mostrar indicador de carga

    try {
      // Autenticar usuario con Firebase Authentication
      const cap_user = await signInWithEmailAndPassword(auth, email, password);
      const user = cap_user.user; // Obtener los datos del usuario autenticado

      // Referencia al documento del usuario en Firestore
      const user_Ref = doc(db, 'users', user.uid);
      const doc_datos_user = await getDoc(user_Ref);

      // Verificar si el usuario existe en Firestore
      if (doc_datos_user.exists()) {
        const datos_user = doc_datos_user.data();

        // Validar que el correo ingresado coincida con el registrado en Firestore
        if (email === datos_user.email) {
          navigation.navigate('Home'); // Redirigir al usuario a la pantalla principal
        } else {
          setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
        }
      } else {
        setErrorMessage("El usuario no existe.");
      }
    } catch (error) {
      // Capturar errores durante el inicio de sesión
      setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  return (
    <KeyboardAvoidingView
      style={LoginScreenStyles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Fondo de la pantalla */}
          <ImageBackground
            source={require('../../assets/background.jpg')}
            style={LoginScreenStyles.imageBackground}
            blurRadius={1}
          >
            <View style={LoginScreenStyles.overlay} />

            <View style={LoginScreenStyles.container}>
              {/* Logo de la app */}
              <Image source={require('../../assets/logo2.png')} style={LoginScreenStyles.logo} />
              <Text style={LoginScreenStyles.welcomeText}>HOLA BIENVENIDO</Text>

              {/* Campo de entrada para el correo */}
              <View style={LoginScreenStyles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#BCC1CAFF" style={LoginScreenStyles.iconLeft} />
                <TextInput
                  placeholder="Correo"
                  placeholderTextColor="#A7ADB7"
                  value={email}
                  onChangeText={setEmail}
                  style={LoginScreenStyles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Campo de entrada para la contraseña */}
              <View style={LoginScreenStyles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#BCC1CAFF" style={LoginScreenStyles.iconLeft} />
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor="#A7ADB7"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={LoginScreenStyles.input}
                />
                {/* Botón para alternar la visibilidad de la contraseña */}
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={LoginScreenStyles.iconRight}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#BCC1CAFF" />
                </TouchableOpacity>
              </View>

        

              {/* Mensaje de error, solo se muestra si existe un error */}
              {errorMessage ? (
                <Text style={LoginScreenStyles.errorText}>{errorMessage}</Text>
              ) : null}

              {/* Botón de inicio de sesión con indicador de carga */}
              <TouchableOpacity
                style={[
                  LoginScreenStyles.loginButton,
                  (!email || !password || !isValidEmail(email)) && LoginScreenStyles.disabledButton
                ]}
                onPress={handleLogin}
                disabled={!email || !password || !isValidEmail(email)}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={LoginScreenStyles.buttonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              {/* Términos y condiciones */}
              <Text style={LoginScreenStyles.termsText}>
                Si continúas, confirmas que leíste la <Text style={LoginScreenStyles.linkText}>Política de Privacidad</Text> y que aceptas los términos y condiciones.
              </Text>

              {/* Enlace para registrarse */}
              <Text style={LoginScreenStyles.registerText}>
                ¿Necesitas crear una cuenta? <Text style={LoginScreenStyles.linkText} onPress={() => navigation.navigate('Register')}>Regístrate</Text>
              </Text>
            </View>
          </ImageBackground>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;