// src/screens/3DView.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Importa WebView

const Header = ({ userData, onMenuToggle }) => (
  <View style={styles.header}>
    <Image source={require('../../assets/logo2.png')} style={styles.logo} />
    {userData && (
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
        <Text style={styles.userProvince}>{userData.selectedProvince}</Text>
      </View>
    )}
    <TouchableOpacity onPress={onMenuToggle}>
      <Image source={require('../../assets/user.jpg')} style={styles.profileImage} />
    </TouchableOpacity>
  </View>
);

const Footer = ({ navigation }) => (
  <View style={styles.footer}>
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Ionicons name="home" size={30} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SplashScreen')}>
      <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('DView')}>
      <Ionicons name="camera" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
);

const ThreeDView = () => {
  const navigation = useNavigation();
  const userData = null; // Aquí puedes obtener los datos del usuario como en HomeScreen

  return (
    <View style={styles.container}>
      <Header userData={userData} onMenuToggle={() => { /* Lógica para mostrar el menú */ }} />
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: 'https://storage.net-fs.com/hosting/2727323/483/' }} // Cambia esta URL a la que desees mostrar
          style={styles.webView}
        />
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#191A2E',
    elevation: 5,
    marginTop: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  userProvince: {
    fontSize: 14,
    color: 'gray',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  webViewContainer: {
    flex: 1, // Ocupa el espacio entre el header y el footer
  },
  webView: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#191A2E',
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
});

export default ThreeDView;