<<<<<<< Updated upstream
"use client"

import { useEffect, useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { getDatabase, ref, onValue } from "firebase/database"
import { auth } from "../services/firebase"
import { useNavigation } from "@react-navigation/native"
import Footer from "../components/Footer"
import CarCarousel from "../components/CarCarousel"
=======
// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking, FlatList } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer'; // Importa el Footer
>>>>>>> Stashed changes

const HomeScreen = () => {
  const [userData, setUserData] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [autos, setAutos] = useState([])
  const [autosSecond, setAutosSecond] = useState([])
  const db = getDatabase()
  const firestoreDb = getFirestore()
  const navigation = useNavigation()

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser
      if (user) {
        const userDoc = await getDoc(doc(firestoreDb, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      }
    }

    fetchUserData()

    const autosRef = ref(db, "autos")
    const unsubscribe = onValue(autosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const autosArray = Object.keys(data).map((key) => ({ id: key, ...data[key] }))

        setAutos(autosArray.slice(0, 10))
        setAutosSecond(autosArray.slice(10, 20))
      }
    })

<<<<<<< Updated upstream
    return () => unsubscribe()
  }, [db, firestoreDb])
=======
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
>>>>>>> Stashed changes

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Welcome")
      })
      .catch((error) => {
        console.error("Error signing out: ", error)
      })
  }

  const openWebsite = () => {
    Linking.openURL("https://ecuador.patiotuerca.com/")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../../assets/logo2.png")} style={styles.logo} />
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
            <Text style={styles.userProvince}>{userData.selectedProvince}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Image source={require("../../assets/user.jpg")} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.card2} onPress={openWebsite}>
          <Image source={require("../../assets/patiotuerca.webp")} style={styles.cardImage} />
          <Text style={styles.cardInfo}>Encuentra lo que necesitas para comprar o vender tu vehículo.</Text>
        </TouchableOpacity>

        <CarCarousel
          title="Autos por Precio"
          data={autos}
          filters={[
            { label: "Mayor", value: "expensive" },
            { label: "Menor", value: "cheap" },
          ]}
          defaultFilter="cheap"
        />

<<<<<<< Updated upstream
        <CarCarousel
          title="Autos por Placa"
=======
        <FlatList
>>>>>>> Stashed changes
          data={autosSecond}
          filters={[
            { label: "Azuay", value: "azuay" },
            { label: "Guayas", value: "guayas" },
            { label: "Pichincha", value: "pichincha" },
          ]}
          defaultFilter={userData?.selectedProvince?.toLowerCase() || "pichincha"}
        />
      </ScrollView>

<<<<<<< Updated upstream
=======
      {/* Usar el componente Footer */}
>>>>>>> Stashed changes
      <Footer activeScreen="Home" navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#191A2E",
    elevation: 5,
    marginTop: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  userProvince: {
    fontSize: 14,
    color: "gray",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menu: {
    position: "absolute",
    right: 10,
    top: 90,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    fontSize: 16,
    color: "#191A2E",
    paddingVertical: 5,
  },
  content: {
    flexGrow: 1,
    padding: 10,
  },
<<<<<<< Updated upstream
=======
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    padding: 5,
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5, // Espaciado horizontal entre tarjetas
    width: 400, // Ancho fijo para las tarjetas
    height: 335,
  },
>>>>>>> Stashed changes
  card2: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 5,
    marginVertical: 10,
<<<<<<< Updated upstream
    alignItems: "center",
    width: 400,
=======
    alignItems: 'center',
    width: 400, // Ancho fijo para las tarjetas
>>>>>>> Stashed changes
    height: 270,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardInfo: {
    padding: 10,
    alignItems: "flex-start",
    textAlign: "left",
    width: "90%",
  },
<<<<<<< Updated upstream
})

export default HomeScreen
=======
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
});
>>>>>>> Stashed changes

