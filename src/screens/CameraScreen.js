import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CameraScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Se necesitan permisos para usar la cámara</Text>
        <Pressable style={styles.cameraButton} onPress={requestPermission}>
          <Text>Otorgar permisos</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (camera) {
      const options = { quality: 0.5 };
      const photo = await camera.takePictureAsync(options);
      navigation.navigate("Resultado", { photo: photo.uri });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={(ref) => setCamera(ref)}
        />
      </View>
      <Pressable style={styles.cameraButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Tomar Foto</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1976d2",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default CameraScreen;