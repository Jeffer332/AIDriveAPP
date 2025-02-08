// src/styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

const LoginScreenStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(48, 46, 46, 0.3)',
  },
  container: {
    width: '85%',
    backgroundColor: 'rgba(22, 21, 21, 0.6)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 450, // Aumenta la altura del contenedor
    paddingVertical: 30, // Más espacio interno
  },
  logo: {
    width: 80,
    height: 90,
    marginBottom: 30,
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent', // Fondo transparente
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BCC1CAFF',
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 15,
  },
  iconLeft: {
    position: 'absolute',
    left: 15,
  },
  iconRight: {
    position: 'absolute',
    right: 15,
  },
  input: {
    flex: 1,
    color: '#FFFFFF', // Texto ingresado en color blanco
    fontSize: 12,
    lineHeight: 28,
    fontWeight: '400',
    paddingLeft: 30, // Espacio para el ícono izquierdo
  },
  disabledButton: {
    backgroundColor: '#A7ADB7', // Color gris indicando inactividad
  },
  
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  forgotPassword: {
    color: '#0583F2',
    fontSize: 14,
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: '#0583F2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
    margin: 14,
  },
  linkText: {
    color: '#0583F2',
    fontWeight: 'bold',
  },
  registerText: {
    color: 'white',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    marginBottom: 9,
    textAlign: 'center',
  }  
});

export default LoginScreenStyles;