// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser  ;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.navigate('Welcome'); // Redirigir a la pantalla "Welcome"
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  const openWebsite = () => {
    Linking.openURL('https://ecuador.patiotuerca.com/'); // Cambia esta URL a la página que desees
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo2.png')} style={styles.logo} />
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
            <Text style={styles.userProvince}>{userData.selectedProvince}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Image source={require('../../assets/user.jpg')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Menú de Usuario */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenido Principal */}
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.card} onPress={openWebsite}>
          <Image source={require('../../assets/patiotuerca.webp')} style={styles.cardImage} />
          <Text style={styles.cardDescription}>
            Patio Tuerca es un lugar donde puedes encontrar todo lo que necesitas para tus proyectos de construcción y reparación.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer con Íconos */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="#191A2E" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SplashScreen')}>
          <Ionicons name="chatbubble-ellipses" size={30} color="#191A2E" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
          <Ionicons name="camera" size={30} color="#191A2E" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DView')}>
          <Ionicons name="logo-apple-ar" size={30} color="#191A2E" />
        </TouchableOpacity>
      </View>
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
  menu: {
    position: 'absolute',
    right: 10,
    top: 90,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    fontSize: 16,
    color: '#191A2E',
    paddingVertical: 5,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    padding: 0,
    marginVertical: 20,
    alignItems: 'center',
    width: '90%',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
});

export default HomeScreen;