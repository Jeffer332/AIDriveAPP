import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImageToAPI } from "../services/api";
import styles from "../styles/CameraScreenStyles"; // 📌 Importamos los estilos separados

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

  async function convertirImagenABase64(uri) {
    try {
      return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
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
          //console.log("Respuesta recibida desde la API:", apiResponse);

          if (apiResponse?.mensaje === "La imagen no es un vehículo") {
            Alert.alert("No se detectó un vehículo", "Por favor, intente tomar la foto nuevamente", [{ text: "Ok" }]);
            setLoading(false);
            return;
          }

          if (apiResponse && apiResponse.descripcion) {
            try {
              const descripcionJSON = JSON.parse(apiResponse.descripcion);
              console.log("Respuesta que se envía a detalles:",descripcionJSON);
              // Navegamos a la nueva pantalla
              navigation.navigate("AutoDetectado", {
                imagenUri: data.uri,
                detalles: descripcionJSON,
              });
          
              setPhoto(data.uri);
            } catch (parseError) {
              console.error("Error al parsear la descripción:", parseError);
            }
          }
        }
      } catch (error) {
        console.log("Error al tomar la foto:", error);
      }
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#2A1943", "#38303B", "#120A19"]} style={{ flex: 1 }}>
      <Header />
      <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={(ref) => setCamera(ref)} />
        </View>

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

        <Footer activeScreen="Camera" navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CameraScreen;
