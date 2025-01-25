import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';

export default function HomeScreen() {
  const userName = 'Jefferson Solano'; // Nombre del usuario
  const userPhoto = require('../assets/user-photo.jpg'); // Imagen del usuario

  return (
    <View style={styles.container}>
      {/* Encabezado con el logo, nombre de usuario y foto */}
      <View style={styles.header}>
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Image source={userPhoto} style={styles.userPhoto} />
        </View>
      </View>

      {/* Tarjetas tipo banner */}
      <View style={styles.cardsContainer}>
        <View style={styles.cardSmall}>
          <Image
            source={{ uri: 'https://static.patiotuerca.com/ghost/ecuador/2024/05/720x366_App_02.jpg' }}
            style={styles.cardImageSmall}
          />
          <Text style={styles.cardTitle}>Patio Tuerca</Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => Linking.openURL('https://www.patiotuerca.com')}
          >
            <Text style={styles.cardButtonText}>Visitar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardSmall}>
          <Image
            source={{ uri: 'https://1001carros.com/images/ciclo1001/ciclo1001.webp' }}
            style={styles.cardImageSmall}
          />
          <Text style={styles.cardTitle}>1001Carros</Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => Linking.openURL('https://1001carros.com/')}
          >
            <Text style={styles.cardButtonText}>Visitar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Carrusel de tarjetas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselContainer}>
        <View style={styles.carouselCard}>
          <Image
            source={{ uri: 'https://example.com/carousel-image1.jpg' }}
            style={styles.carouselImage}
          />
          <Text style={styles.carouselTitle}>Oferta Especial</Text>
        </View>

        <View style={styles.carouselCard}>
          <Image
            source={{ uri: 'https://example.com/carousel-image2.jpg' }}
            style={styles.carouselImage}
          />
          <Text style={styles.carouselTitle}>Nuevo Lanzamiento</Text>
        </View>

        <View style={styles.carouselCard}>
          <Image
            source={{ uri: 'https://example.com/carousel-image3.jpg' }}
            style={styles.carouselImage}
          />
          <Text style={styles.carouselTitle}>Promoción Limitada</Text>
        </View>
      </ScrollView>

      {/* Botones de navegación inferior */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Pestaña 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Pestaña 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Pestaña 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cardSmall: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageSmall: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  carouselContainer: {
    marginBottom: 100, // Aumentamos el margen inferior para evitar que quede detrás de los botones
    paddingLeft: 20,
  },
  carouselCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    width: 300, // Ancho aumentado
  },
  carouselImage: {
    width: '100%',
    height: 130, // Altura aumentada
    borderRadius: 10,
    marginBottom: 10,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40, // Subido desde 60
    left: 20,
    right: 20,
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12, // Botón más alto
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
