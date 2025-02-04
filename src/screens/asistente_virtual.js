// src/screens/asistente_virtual.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { getAutoRecommendation } from "../services/api";

const BOT_IMAGE = require("../../assets/perfil_av.png");

const AsistenteVirtual = ({ navigation }) => {
  // Estados 
  const [messages, setMessages] = useState([]); // Para almacenar mensajes
  const [inputText, setInputText] = useState(""); // Para manejar texto de entrada
  const [speakingMessage, setSpeakingMessage] = useState(null); // Control de mensaje que se esta reproduciendo
  const [isTyping, setIsTyping] = useState(false); // Indicador de "escribiendo.."
  const flatListRef = useRef(null); //"Scroll"

  // Scroll automático
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  // Función para enviar mensajes
  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return; // Evita enviar si el bot está respondiendo

    // Agregamos el mensaje del usuario a la lista
    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText(""); // Limpiamos el campo de entrada
    setIsTyping(true); // Indicar que esta "Escribiendo..."

    try {
      // Respuesta del AV
      const response = await getAutoRecommendation(inputText);
      setTimeout(() => {
        setIsTyping(false); // Detenemos el "Escribiendo..."
        // Agregamos la respuesta del AV a la lista
        setMessages((prev) => [...prev, { sender: "bot", text: response.sugerencias }]);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error al comunicarse con el servidor." }]);
    }
  };


  // Función para copiar mensaje
  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    ToastAndroid.show("Texto copiado al portapapeles", ToastAndroid.SHORT);
  };
  // Función para texto a voz
  const toggleSpeakMessage = (text, index) => {
    if (speakingMessage === index) {
      Speech.stop();
      setSpeakingMessage(null);
    } else {
      // 🔹 LIMPIAR TEXTO Markdown antes de la conversión de voz
      let cleanText = text
        .replace(/\*\*(.*?)\*\*/g, "$1")  // Quita **negrita**
        .replace(/\*(.*?)\*/g, "$1")      // Quita *cursiva*
        .replace(/^[-•*]\s+/gm, "")       // Quita viñetas como "- ", "• ", "* "
        .replace(/\n/g, " ");             // Quita saltos de línea
  
      Speech.speak(cleanText, {
        language: "es",
        pitch: 1,
        rate: 1,
        onDone: () => setSpeakingMessage(null),
        onStopped: () => setSpeakingMessage(null),
      });
  
      setSpeakingMessage(index);
    }
  };


  // Función para mandar los mensajes al lado de la lista
  const renderMessage = ({ item, index }) => (
    <View style={{ flexDirection: item.sender === "user" ? "row-reverse" : "row", marginVertical: 6, paddingHorizontal: 12 }}>
      {/* Imagen del bot */}
      {item.sender === "bot" && (
        <Image source={BOT_IMAGE} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 6 }} />
      )}
      <View style={{ backgroundColor: item.sender === "user" ? "#3b3033" : "#38303B", padding: 10, borderRadius: 10, maxWidth: "75%" }}>
        {/* Etiqueta de identificación del AV */}
        {item.sender === "bot" && !item.isTyping && (
          <Text style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 4 }}>AIDrive</Text>
        )}
        {/* Etiqueta "Escribiendo.." */}
        {item.isTyping ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={{ color: "white", fontSize: 12, marginLeft: 4 }}>AIDrive está escribiendo...</Text>
          </View>
        ) : (
          //Mostrar el mensaje con formato Markdown (negritas, listas, etc.)
          <Markdown style={{ body: { color: "white", fontSize: 12 } }}>
            {item.text}
          </Markdown>
        )}

        {/* Botones de Voz y Copiar */}
        {item.sender === "bot" && !item.isTyping && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 5 }}>
            {/* Botón para escuchar el mensaje */}
            <TouchableOpacity onPress={() => toggleSpeakMessage(item.text, index)} style={{ marginRight: 10 }}>
              <Ionicons name={speakingMessage === index ? "volume-mute" : "volume-high"} size={18} color="#ffffff" />
            </TouchableOpacity>
            {/* Botón para copiar el mensaje*/}
            <TouchableOpacity onPress={() => copyToClipboard(item.text)}>
              <Ionicons name="copy" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a2e" }}>
        {/* Encabezado con Gradiente */}
        <LinearGradient
          colors={["#2E1E42", "#3F2C59", "#1F1724"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          // Estilo y grosor del encabezado
          style={{ paddingBottom: 7, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, elevation: 4 }}
        >
          {/* botones de regresar */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 1, paddingTop: 45 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>AIDrive</Text>
            <TouchableOpacity style={{ padding: 8 }}>
              <Ionicons name="ellipsis-horizontal" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", marginTop: -12 }}>
            <Text style={{ color: "#D5DBDB", fontSize: 10, opacity: 0.90 }}>Conduce tus sueños, hazlos realidad...</Text>
          </View>
        </LinearGradient>

        {/* Lista de mensajes */}
        <FlatList
          ref={flatListRef}
          data={messages.concat(isTyping ? [{ sender: "bot", text: "escribiendo...", isTyping: true }] : [])}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled" // Permite cerrar el teclado tocando la lista
          keyboardDismissMode="interactive" // Cierra el teclado al hacer scroll
        />

        {/* Barra de entrada de texto */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#2e2e52", borderRadius: 25, margin: 16 }}>
          <TextInput
            style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12, color: "white", backgroundColor: "#4e4e7a", borderRadius: 25, fontSize: 12 }}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#aaaaaa"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} disabled={isTyping} style={{ marginLeft: 12, padding: 12, backgroundColor: isTyping ? "#666" : "#007aff", borderRadius: 50 }}>
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default AsistenteVirtual;