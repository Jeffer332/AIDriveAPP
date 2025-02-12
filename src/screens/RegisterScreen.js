// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../services/firebase'; // Importa la conexión a Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importa la función de registro
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Importa Firestore
import RegisterScreenStyles from '../styles/RegisterScreenStyles'; // Importa los estilos
import { Ionicons } from '@expo/vector-icons';
import ProvinceDropdown from '../components/ProvinceDropdown'; // Importa el componente de provincias
import Toast from 'react-native-toast-message'; // 🔹 Importamos la librería para mensajes bonitos

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(null); // Inicializa el estado de la provincia seleccionada
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('Débil');
  const [showPasswordStrength, setShowPasswordStrength] = useState(false); // Inicializamos para ver la barra cuando escriba

  const db = getFirestore(); // Inicializa Firestore

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showToast = (type, message) => {
    Toast.show({
      type: type, // 'success' | 'error' | 'info'
      text1: message,
      position: 'top',
      visibilityTime: 4000, // Tiempo que se muestra el mensaje
      autoHide: true,
      topOffset: 50, // Posición desde la parte superior
    });
  };

  const handleRegister = async () => {
    if (!name || !surname || !selectedProvince || !email || !password) {
      showToast('error', 'Por favor, completa todos los campos.');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('error', 'Por favor, introduce un correo válido.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda los datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        selectedProvince,
        email,
        passwordStrength,
      });

      showToast('success', 'Registro exitoso 🎉');
      navigation.navigate('Home'); // Redirige a la siguiente pantalla
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showToast('error', 'El correo ya está en uso. Intenta con otro.');
      } else {
        showToast('error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordStrength = (password) => {
    if (password.length < 6) return 'Débil';
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[\W]/.test(password)) {
      return 'Fuerte';
    }
    return 'Media';
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setShowPasswordStrength(value.length > 0); // Solo muestra la barra si el usuario ha escrito algo
    setPasswordStrength(validatePasswordStrength(value));
  };

  return (
    <>
      <KeyboardAvoidingView
        style={RegisterScreenStyles.background}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
<<<<<<< Updated upstream
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <ImageBackground
              source={require('../../assets/background.jpg')}
              style={RegisterScreenStyles.imageBackground}
              blurRadius={1}
            >
              <View style={RegisterScreenStyles.overlay} />
=======
        <View style={RegisterScreenStyles.container}>
          <Image source={require('../../assets/logo.png')} style={RegisterScreenStyles.logo} />
>>>>>>> Stashed changes

              <View style={RegisterScreenStyles.container}>
                <Image source={require('../../assets/logo2.png')} style={RegisterScreenStyles.logo} />
                <Text style={RegisterScreenStyles.welcomeText}>Crea tu cuenta</Text>

                {/* Nombre y Apellido en la misma línea */}
                <View style={RegisterScreenStyles.rowContainer}>
                  <View style={[RegisterScreenStyles.inputContainer, { flex: 1, marginRight: 5 }]}>
                    <Ionicons name="person-outline" size={20} color="#BCC1CAFF" style={RegisterScreenStyles.iconLeft} />
                    <TextInput
                      placeholder="Nombre"
                      placeholderTextColor="#A7ADB7"
                      value={name}
                      onChangeText={setName}
                      style={RegisterScreenStyles.input}
                    />
                  </View>

                  <View style={[RegisterScreenStyles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                    <Ionicons name="person-outline" size={20} color="#BCC1CAFF" style={RegisterScreenStyles.iconLeft} />
                    <TextInput
                      placeholder="Apellido"
                      placeholderTextColor="#A7ADB7"
                      value={surname}
                      onChangeText={setSurname}
                      style={RegisterScreenStyles.input}
                    />
                  </View>
                </View>

                {/* Selector de provincia */}
                <ProvinceDropdown value={selectedProvince} onChange={setSelectedProvince} />

                <View style={RegisterScreenStyles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#BCC1CAFF" style={RegisterScreenStyles.iconLeft} />
                  <TextInput
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#A7ADB7"
                    value={email}
                    onChangeText={setEmail}
                    style={RegisterScreenStyles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Campo de contraseña con icono de ojo */}
                <View style={RegisterScreenStyles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#BCC1CAFF" style={RegisterScreenStyles.iconLeft} />
                  <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#A7ADB7"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    style={RegisterScreenStyles.input}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={RegisterScreenStyles.iconRight}>
                    <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#BCC1CAFF" />
                  </TouchableOpacity>
                </View>

                {/* Barra de fortaleza de la contraseña */}
                {showPasswordStrength && (
                  <>
                    <View style={RegisterScreenStyles.passwordStrengthBarContainer}>
                      <View
                        style={[
                          RegisterScreenStyles.passwordStrengthBar,
                          {
                            backgroundColor: passwordStrength === 'Débil' ? 'red' : passwordStrength === 'Media' ? 'orange' : 'green',
                            width: passwordStrength === 'Débil' ? '33%' : passwordStrength === 'Media' ? '66%' : '100%'
                          }
                        ]}
                      />
                    </View>
                    <Text style={[RegisterScreenStyles.passwordStrength, { color: passwordStrength === 'Débil' ? 'red' : passwordStrength === 'Media' ? 'orange' : 'green' }]}>
                      Fortaleza de la contraseña: {passwordStrength}
                    </Text>
                  </>
                )}

                <TouchableOpacity style={RegisterScreenStyles.button} onPress={handleRegister}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={RegisterScreenStyles.buttonText}>Registrarse</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={RegisterScreenStyles.loginText}>
                    ¿Ya tienes una cuenta? <Text style={RegisterScreenStyles.link}>Inicia sesión</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/*Componente Toast para mostrar mensajes bonitos */}
      <Toast />
    </>
  );
};

export default RegisterScreen;
