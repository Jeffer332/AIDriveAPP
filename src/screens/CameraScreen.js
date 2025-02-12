// src/screens/CameraScreen.js
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< Updated upstream
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImageToAPI } from "../services/api";
import styles from "../styles/CameraScreenStyles"; // 📌 Importamos los estilos separados
=======
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import Footer from '../components/Footer';
import Header from '../components/Header';
>>>>>>> Stashed changes

const CameraScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={["#2A1943", "#38303B", "#120A19"]} style={{ flex: 1 }}>
        <View style={styles.permission}> 
          <Text style={{ color: "white" }}>Se necesitan permisos para usar la cámara</Text>
          <Pressable style={styles.cameraButton} onPress={requestPermission}>
            <Text>Otorgar permisos</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

<<<<<<< Updated upstream
  async function convertirImagenABase64(uri) {
    try {
      return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
=======
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
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error al convertir imagen a Base64:", error);
      return null;
    }
  }

  const takePhoto = async () => {
    if (camera) {
      setLoading(true);
      try {
        const options = { quality: 0.5, exif: false };
        const data = await camera.takePictureAsync(options);
        const base64Image = await convertirImagenABase64(data.uri);

        if (base64Image) {
          console.log("Enviando imagen a la API...");
          const apiResponse = await uploadImageToAPI(`data:image/png;base64,${base64Image}`);
          console.log("Respuesta recibida desde la API:", apiResponse);

          if (apiResponse?.mensaje === "La imagen no es un vehículo") {
            Alert.alert("No se detectó un vehículo", "Por favor, intente tomar la foto nuevamente", [{ text: "Ok" }]);
            setLoading(false);
            return;
          }

          if (apiResponse && apiResponse.descripcion) {
            try {
              // Parseamos la descripción que viene como string
              const descripcionJSON = JSON.parse(apiResponse.descripcion);
              const mensaje = `¿Sabes algo sobre el ${descripcionJSON.marca} ${descripcionJSON.modelo}?`;

              // Navegamos con la información procesada
              navigation.navigate("AsistenteVirtual", {
                apiResponse,
                autoDetectado: {
                  mensaje,
                  detalles: descripcionJSON,
                  enviarAutomaticamente: true,
                  imagenUri: data.uri,
                },
              });

              setPhoto(data.uri);
            } catch (parseError) {
              console.error("Error al parsear la descripción:", parseError);
            }
          } else {
            console.error("La respuesta de la API no tiene el formato esperado:", apiResponse);
          }
        }
      } catch (error) {
        console.log("Error al tomar la foto:", error);
      }
    }
    setLoading(false);
  };

  return (
<<<<<<< Updated upstream
    <LinearGradient colors={["#2A1943", "#38303B", "#120A19"]} style={{ flex: 1 }}>
      <Header />
      <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
=======
    <LinearGradient 
      colors={['#2A1943', '#38303B', '#120A19']} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}> {/* Excluye la parte superior */}
        <Header />
>>>>>>> Stashed changes
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={(ref) => setCamera(ref)} />
        </View>
<<<<<<< Updated upstream

        {loading && (
          <View style={styles.loading}>
            <Image source={require("../../assets/car-keys-load.gif")} style={styles.loadingImage} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable onPress={takePhoto}>
            <LinearGradient colors={["#2A1943", "#38303B", "#120A19"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cameraButton}>
              <Text style={styles.buttonText}>Captura al auto de tus sueños</Text>
              <Ionicons name="camera-outline" size={24} color="white" />
            </LinearGradient>
          </Pressable>
        </View>

=======
        <Pressable style={styles.cameraButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </Pressable>
        {/* Usar el componente Footer */}
>>>>>>> Stashed changes
        <Footer activeScreen="Camera" navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
};

<<<<<<< Updated upstream
export default CameraScreen;
=======
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
>>>>>>> Stashed changes
