// src/screens/CameraScreen.js
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import Footer from '../components/Footer';
import Header from '../components/Header';
import "../../global.css"

const CameraScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={['#2A1943', '#38303B', '#120A19']}
        className = "flex-1"
      >
        <View className = "flex flex-1 items-center justify-center">
          <Text className = "color-white">Se necesitan permisos para usar la cámara</Text>
          <Pressable style={styles.cameraButton} onPress={requestPermission}>
            <Text>Otorgar permisos</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  async function llamarApi(imageData) {
    try {
      const response = await fetch('http://10.116.15.177:8000/upload_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      console.log("Respuesta de la API:", data);
    } catch (error) {
      console.error("Error al llamar la API:", error);
    }
  }

  async function convertirImagenABase64(uri) {
    try {
      return await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error("Error al convertir imagen a Base64:", error);
      return null;
    }
  }

  const takePhoto = async () => {
    if (camera) {
      try {
        const options = { quality: 0.5, exif: false };
        const data = await camera.takePictureAsync(options);
        const base64Image = await convertirImagenABase64(data.uri);

        if (base64Image) {
          console.log("Enviando imagen a la API...");
          await llamarApi(`data:image/png;base64,${base64Image}`);
        }
      } catch (error) {
        console.log("Error al tomar la foto:", error);
      }
    }
  };

  return (
    <LinearGradient 
      colors={['#2A1943', '#38303B', '#120A19']} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}> {/* Excluye la parte superior */}
        <Header />
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={(ref) => setCamera(ref)}
          />
        </View>
        <Pressable style={styles.cameraButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </Pressable>
        {/* Usar el componente Footer */}
        <Footer activeScreen="Camera" navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distribuye el espacio entre el header, la cámara y el footer
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 80,
    overflow: "hidden",
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  camera: {
    width: '95%', // Asegúrate de que la cámara ocupe todo el ancho
    height: '95%', // Asegúrate de que la cámara ocupe todo el alto
  },
  cameraButton: {
    marginBottom: 60, // Espacio entre la cámara y el botón
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#8A76B5",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    padding: 5,
  },
});

export default CameraScreen;