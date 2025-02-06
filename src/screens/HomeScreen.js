// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [autos, setAutos] = useState([]); // Estado para almacenar los autos
  const [autosSecond, setAutosSecond] = useState([]); // Estado para almacenar los autos del segundo carrusel
  const db = getDatabase();
  const firestoreDb = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser ;
      if (user) {
        const userDoc = await getDoc(doc(firestoreDb, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();

    // Obtener datos de autos
    const autosRef = ref(db, 'autos'); // Referencia a la colección "autos"
    const unsubscribe = onValue(autosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const autosArray = Object.keys(data) // Obtiene las claves únicas de los autos
          .slice(9, 12) // Solo los primeros 6 registros
          .map((key) => ({ id: key, ...data[key] })); // Convierte en un array de objetos

        setAutos(autosArray);
      }
    });

     // Obtener datos de autos para el segundo carrusel
     const unsubscribeSecond = onValue(autosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const autosSecondArray = Object.keys(data) // Obtiene las claves únicas de los autos
          .slice(15, 19) // Solo los registros del 16 al 18
          .map((key) => ({ id: key, ...data[key] })); // Convierte en un array de objetos

        setAutosSecond(autosSecondArray);
      }
    });

    return () => {
      unsubscribe(); // Limpieza del listener
      unsubscribeSecond(); // Limpieza del segundo listener
    };
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
        {/* Tarjeta de Patio Tuerca */}
        <TouchableOpacity style={styles.card2} onPress={openWebsite}>
          <Image source={require('../../assets/patiotuerca.webp')} style={styles.cardImage} />
          <Text style={styles.cardDescription}>
            Encuentra lo que necesitas para comprar o vender tu vehículo.
          </Text>
        </TouchableOpacity>

        {/* Carrusel de autos */}
        <FlatList
          data={autos}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.ImagenURL }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{`Marca: ${item.Marca || 'N/A'}`}</Text>
                <Text style={styles.cardSubtitle}>{`Modelo: ${item.Modelo || 'N/A'}`}</Text>
                <Text style={styles.cardDetails}>{`Año/Kms: ${item.AñoKms || 'N/A'}`}</Text>
                <Text style={styles.cardPrice}>{`Precio: ${item.Precio || 'N/A'}`}</Text>
                <Text style={styles.cardPlate}>{`Placa: ${item.Placa || 'N/A'}`}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        />

<FlatList
          data={autosSecond}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.ImagenURL }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{`Marca: ${item.Marca || 'N/A'}`}</Text>
                <Text style={styles.cardSubtitle}>{`Modelo: ${item.Modelo || 'N/A'}`}</Text>
                <Text style={styles.cardDetails}>{`Año/Kms: ${item.AñoKms || 'N/A'}`}</Text>
                <Text style={styles.cardPrice}>{`Precio: ${item.Precio || 'N/A'}`}</Text>
                <Text style={styles.cardPlate}>{`Placa: ${item.Placa || 'N/A'}`}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        />
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
    padding: 5,
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5, // Espaciado horizontal entre tarjetas
    alignItems: 'center',
    width: 400, // Ancho fijo para las tarjetas
    height: 335,
  },
  card2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    padding: 5,
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5, // Espaciado horizontal entre tarjetas
    alignItems: 'center',
    width: 400, // Ancho fijo para las tarjetas
    height: 250,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardInfo: {
    padding: 10,
    alignItems: 'flex-start',
    textAlign: 'left', width: '90%'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191A2E',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
  },
  cardDetails: {
    fontSize: 14,
    color: '#777',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745', // Color verde para el precio
  },
  cardPlate: {
    fontSize: 14,
    color: '#777',
  },
  carousel: {
    paddingVertical: 10,
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