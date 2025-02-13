import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    borderColor: "#0583F2",
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
  permission: { // Corregí el error tipográfico "perimssion" -> "permission"
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
