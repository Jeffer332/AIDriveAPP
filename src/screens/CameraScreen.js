import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View,Alert } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImageToAPI } from "../services/api";

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
      <LinearGradient
        colors={["#2A1943", "#38303B", "#120A19"]}
        style={{ flex: 1 }}
      >
        <View style={styles.perimssion}>
          <Text style={{ color: "white" }}>
            Se necesitan permisos para usar la cámara
          </Text>
          <Pressable style={styles.cameraButton} onPress={requestPermission}>
            <Text>Otorgar permisos</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
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
      setLoading(true);
      try {
        const options = { quality: 0.5, exif: false };
        const data = await camera.takePictureAsync(options);
        const base64Image = await convertirImagenABase64(data.uri);

        if (base64Image) {
          console.log("Enviando imagen a la API...");
          const apiResponse = await uploadImageToAPI(
            `data:image/png;base64,${base64Image}`
          );
          //Imprimimos la respuesta en consola
          console.log("Respuesta recibida desde la API:", apiResponse);

          //verificamos si la respuesta recibida es de un vehículo para evitar errores
          if(apiResponse.mensaje === "La imagen no es un vehículo"){
            Alert.alert(
              "No se detectó un vehículo",
              "por favor, intente tomar la foto nuevamente",
              [{text: "Ok"}]
            );
            setLoading(false);
            return;
          };

          if (apiResponse && apiResponse.descripcion) {
            try {
              // Parseamos la descripción que viene como string
              const descripcionJSON = JSON.parse(apiResponse.descripcion);
              const mensaje = `¿Sabes algo sobre el ${descripcionJSON.marca} ${descripcionJSON.modelo}?`;

              // Navegamos con la información procesada
              navigation.navigate("AsistenteVirtual", {
                apiResponse: apiResponse,
                autoDetectado: {
                  mensaje: mensaje,
                  detalles: descripcionJSON,
                },
              });

              setPhoto(data.uri);
            } catch (parseError) {
              console.error("Error al parsear la descripción:", parseError);
            }
          } else {
            console.error(
              "La respuesta de la API no tiene el formato esperado:",
              apiResponse
            );
          }
        }
      } catch (error) {
        console.log("Error al tomar la foto:", error);
      }
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={["#2A1943", "#38303B", "#120A19"]}
      style={{ flex: 1 }}
    >
      <Header />
      <SafeAreaView
        style={styles.container}
        edges={["right", "bottom", "left"]}
      >
        {/* Contenedor de la cámara */}
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={(ref) => setCamera(ref)} />
        </View>
        {/* Overlay de carga */}
        {loading && (
          <View style={styles.loading}>
            <Image
              source={require("../../assets/car-keys-load.gif")}
              style={styles.loadingImage}
            />
          </View>
        )}
        {/* Botón de captura */}
        <View style={styles.buttonContainer}>
          <Pressable onPress={takePhoto}>
            <LinearGradient
              colors={["#2A1943", "#38303B", "#120A19"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cameraButton}
            >
              <Text style={styles.buttonText}>
                Captura al auto de tus sueños
              </Text>
              <Ionicons name="camera-outline" size={24} color="white" />
            </LinearGradient>
          </Pressable>
        </View>
        {/* Footer */}
        <Footer activeScreen="Camera" navigation={navigation} />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Distribuye el espacio entre el header, la cámara y el footer
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 90,
    overflow: "hidden",
    justifyContent: "center", // Centra la cámara verticalmente
    alignItems: "center", // Centra la cámara horizontalmente
  },
  camera: {
    width: "90%", // Ajusta el ancho de la cámara
    height: "90%", // Ajusta el alto de la cámara
    borderRadius: 30,
  },
  buttonContainer: {
    alignItems: "center", // Centra el botón horizontalmente
    marginBottom: 85, // Espacio entre el botón y el footer
  },
  cameraButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#6A0DAD",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    padding: 5,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 20, 0.8)",
  },
  loadingImage: {
    width: 70,
    height: 70,
  },
  perimssion: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CameraScreen;
