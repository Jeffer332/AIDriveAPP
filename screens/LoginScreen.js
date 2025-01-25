import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Controla si estamos en la pantalla de login o registro

  const handleLogin = async () => {
    try {
      // Buscar usuario en AsyncStorage
      const userData = await AsyncStorage.getItem(email);
      if (!userData) {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
        return;
      }

      const user = JSON.parse(userData);
      if (user.password !== password) {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
        return;
      }

      // Navegar a HomeScreen
      Alert.alert('Éxito', 'Inicio de sesión exitoso.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
    }
  };

  const handleToggleScreen = (screen) => {
    setIsLogin(screen === 'login'); // Cambiar entre login y registro
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Imagen que ocupa toda la mitad superior de la pantalla */}
          <Image 
            source={require('../assets/background.jpg')} 
            style={styles.banner} 
          />

          {/* Contenedor del formulario con bordes curvos */}
          <View style={styles.formContainer}>
            {/* Logo sobre los botones y más grande */}
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
            />

            {/* Botones de Login y Registro */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.toggleButton, isLogin && styles.activeButton]} 
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.toggleButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleButton, !isLogin && styles.activeButton]} 
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.toggleButtonText}>Registro</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput 
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput 
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={isLogin ? handleLogin : () => Alert.alert('Función de registro en desarrollo')}>
                <Text style={styles.buttonText}>{isLogin ? 'Ingresar' : 'Registrarse'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    alignItems: 'center',
    paddingTop: 0  // Eliminado margen superior
  },
  banner: { 
    width: '100%', 
    height: '50%', 
    resizeMode: 'cover', 
  },
  formContainer: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10, 
    marginTop: -40, // Este valor se puede ajustar si necesitas que esté aún más arriba
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleButton: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d0d0d0',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { 
    width: 120,  // Aumentamos el tamaño del logo
    height: 120, 
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#f0f0f5', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    fontSize: 16, 
    borderColor: '#d0d0d0', 
    borderWidth: 1
  },
  button: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 15, 
    borderRadius: 12, 
    width: '100%', 
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});
