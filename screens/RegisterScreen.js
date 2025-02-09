import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Débil');

  // Validar correo
  const validateEmail = (email) => {
    if (typeof email !== 'string') {
        return false; // Asegurarse de que el input sea una cadena
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim()); // Eliminar espacios en blanco al inicio y final
};

// Validar fortaleza de la contraseña
const validatePasswordStrength = (password) => {
  if (!password) return 'Débil';

  let strengthPoints = 0;

  if (password.length >= 8) strengthPoints++; // Longitud mínima recomendada
  if (/[A-Z]/.test(password)) strengthPoints++; // Contiene mayúscula
  if (/[a-z]/.test(password)) strengthPoints++; // Contiene minúscula
  if (/\d/.test(password)) strengthPoints++; // Contiene número
  if (/[\W_]/.test(password)) strengthPoints++; // Contiene carácter especial

  if (strengthPoints >= 5) return 'Fuerte';
  if (strengthPoints >= 3) return 'Media';
  
  return 'Débil';
  };
  // Manejar cambios en la contraseña
  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(validatePasswordStrength(value));
  };

  // Manejar registro
  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingrese un correo válido.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (passwordStrength === 'Débil') {
      Alert.alert('Error', 'La contraseña debe ser más fuerte.');
      return;
    }

    try {
      // Verificar si el correo ya está registrado
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser) {
        Alert.alert('Error', 'El correo ya está registrado.');
        return;
      }

      // Guardar datos en AsyncStorage
      const userData = { name, email, password };
      await AsyncStorage.setItem(email, JSON.stringify(userData));
      Alert.alert('Éxito', 'Usuario registrado con éxito.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrar el usuario.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image 
        source={require('../assets/register-banner.jpg')} 
        style={styles.banner} 
      />

      {/* ScrollView para contenido móvil */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Cuadro blanco con el logo y formulario */}
        <View style={styles.form}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo2.png')} 
              style={styles.logo} 
            />
          </View>

          {/* Botones de Login y Registrar encima del formulario */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.switchButton, styles.loginButton]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.switchButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.switchButton, styles.registerButton]} 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.switchButtonText}>Registrar</Text>
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <TextInput 
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput 
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput 
            placeholder="Contraseña"
            value={password}
            onChangeText={handlePasswordChange}
            style={styles.input}
            secureTextEntry
          />

          {/* Barra de fortaleza */}
          <View style={styles.passwordStrengthBarContainer}>
            <View 
              style={[
                styles.passwordStrengthBar, 
                {
                  backgroundColor: passwordStrength === 'Débil' ? 'red' : passwordStrength === 'Media' ? 'orange' : 'green',
                  width: passwordStrength === 'Débil' ? '33%' : passwordStrength === 'Media' ? '66%' : '100%'
                }
              ]}
            />
          </View>

          {/* Indicador de fortaleza */}
          <Text style={[styles.passwordStrength, { textAlign: 'left' }]}>
            Fortaleza: {passwordStrength}
          </Text>

          <TextInput 
            placeholder="Validar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  banner: { 
    width: '100%', 
    height: 250,  
    resizeMode: 'cover',
    position: 'absolute', 
    top: 0, 
    left: 0 
  },
  formContainer: { 
    flexGrow: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: '50%',  
  },
  form: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 20,  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: { 
    width: 100,  
    height: 100, 
    resizeMode: 'contain' 
  },
  input: { 
    width: '100%',
    height: 45,  
    fontSize: 16,  
    borderWidth: 1, 
    borderColor: '#ccc',  
    borderRadius: 8,  
    paddingLeft: 15,  
    marginBottom: 12,  
  },
  passwordStrength: { 
    fontSize: 14,  
    marginBottom: 12,  
  },
  passwordStrengthBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordStrengthBar: {
    height: '100%',
    borderRadius: 5,
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 16,  
    borderRadius: 15,  
    alignItems: 'center', 
    marginBottom: 20,
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16,  
    fontWeight: 'bold' 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  switchButton: { 
    width: '48%', 
    padding: 16,  
    borderRadius: 15,  
    alignItems: 'center',
  },
  loginButton: { 
    backgroundColor: '#d0d0d0', 
  },
  registerButton: { 
    backgroundColor: '#007AFF', 
  },
  switchButtonText: { 
    color: 'white', 
    fontSize: 16,  
    fontWeight: 'bold' 
  },
});
