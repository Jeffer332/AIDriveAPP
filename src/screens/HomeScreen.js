// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Asegúrate de que esta importación sea correcta
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser ;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User  cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        await updateDoc(doc(db, 'users', auth.currentUser .uid), {
          profileImage: uri,
        });
        setUserData((prevData) => ({ ...prevData, profileImage: uri }));
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
            <Text style={styles.userProvince}>{userData.selectedProvince}</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleImagePicker}>
          <Image source={{ uri: userData?.profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text>Contenido principal aquí</Text>
        <Text style={styles.extraContent}>Más contenido para hacer scroll...</Text>
      </ScrollView>

      {/* Footer con Íconos */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="#006600" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-ellipses" size={30} color="#006600" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
          <Ionicons name="camera" size={30} color="#006600" />
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
    backgroundColor: '#fff',
    elevation: 5,
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
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraContent: {
    fontSize: 16,
    marginVertical: 10,
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
    height: 70, // Aumenta la altura del footer para mayor visibilidad
  },
});

export default HomeScreen;