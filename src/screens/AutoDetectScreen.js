import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../styles/AutoDetectScreenStyles"

const AutoDetectadoScreen = ({ route, navigation }) => {
  const { imagenUri, detalles } = route.params;
  console.log("Recomendación recibida:", detalles.recomendacion);
  return (
    <LinearGradient
      colors={["#2A1943", "#38303B", "#120A19"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <LinearGradient
          colors={["#2E1E42", "#3F2C59", "#1F1724"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Auto Detectado</Text>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          {/* Imagen capturada */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: imagenUri }} style={styles.carImage} />
          </View>

          {/* Detalles del auto */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Detalles del Vehículo</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Marca:</Text>
                <Text style={styles.value}>{detalles.marca}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Modelo:</Text>
                <Text style={styles.value}>{detalles.modelo}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Año:</Text>
                <Text style={styles.value}>{detalles.año}</Text>
              </View>
            </View>
          </View>

          {/* Recomendación */}
          <View style={styles.recommendationContainer}>
            <Text style={styles.sectionTitle}>Recomendación</Text>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationText}>
                {detalles.recomendacion}
              </Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("AsistenteVirtual", {
                  autoDetectado: {
                    mensaje: `Hola quiero un ${detalles.marca} ${detalles.modelo} que me puedas recomendar`,
                    detalles,
                    enviarAutomaticamente: true,
                  },
                })
              }
            >
              <LinearGradient
                colors={["#2A1943", "#38303B", "#120A19"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Consultar al Asistente</Text>
                <Ionicons name="chatbubble-outline" size={20} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate("Camera")}
            >
              <LinearGradient
                colors={["#38303B", "#2A1943", "#120A19"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Tomar Otra Foto</Text>
                <Ionicons name="camera-outline" size={20} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default AutoDetectadoScreen;
