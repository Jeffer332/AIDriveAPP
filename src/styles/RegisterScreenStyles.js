// src/screens/RegisterScreenStyles.js
import { StyleSheet } from 'react-native';

const RegisterScreenStyles = StyleSheet.create({
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
    minHeight: 450,
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
  input: {
    flex: 1,
    color: 'white',
    fontSize: 12,
    paddingLeft: 30,
  },
  button: {
    backgroundColor: '#0583F2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#0583F2',
    marginTop: 10,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BCC1CAFF',
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  dropdown: {
    flex: 1,
    fontSize: 14,
    color: 'white',
  },
  // Caja de opciones
  dropdownItemText: {
    fontSize: 12,
    color: 'black',
    paddingVertical: 1,
    textAlign: 'left',
  },
  dropdownList: {
    width: '100%', // Para que ocupe el mismo ancho que los inputs
    backgroundColor: 'white',
    borderRadius: 6,
    maxHeight: 200, // Limitar el alto de la lista
  },
  // texto dentro de provincia
  dropdownPlaceholder: {
    fontSize: 12,
    color: '#A7ADB7',
    paddingLeft: 30,
  },
  dropdownText: {
    fontSize: 14,
    color: 'white', 
    paddingLeft: 30, 
  },
  loginText: {
    padding: 10,
    color: 'white',
    fontSize: 14,
  },  
  rowContainer: {
    flexDirection: 'row', //Alinea los inputs en fila
    width: '100%', 
    justifyContent: 'space-between', //Separa los inputs de manera uniforme
  },
  iconRight: {
    position: 'absolute',
    right: 15, // 🔹 Ajusta la posición a la derecha del campo de contraseña
  },
  passwordStrengthBarContainer: {
    height: 4,
    width: '65%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 1,
  },
  passwordStrengthBar: {
    height: '100%',
    borderRadius: 5,
  },
  passwordStrength: {
    fontSize: 11,
    marginTop: 5,
    padding: 10,
  },
  

});

export default RegisterScreenStyles;
