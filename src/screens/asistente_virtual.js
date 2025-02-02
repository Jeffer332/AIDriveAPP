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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard"; //Copiar texto de mensajes
import * as Speech from "expo-speech";
import { getAutoRecommendation } from "../services/api";

const BOT_IMAGE = require("../../assets/perfil_av.png");

// Componentes principales de AsistenteVirtual
const AsistenteVirtual = ({ navigation }) => {
  // Estados para manejar los mensajes y la entrada de texto
  const [messages, setMessages] = useState([]); // Almacena los mensajes de la lista
  const [inputText, setInputText] = useState(""); // Texto ingresado
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado si esl bot esta hablando
  const [isTyping, setIsTyping] = useState(false); // Estado de si esta escribiendo...
  // Scroll automático al final del mensaje
  const flatListRef = useRef(null);
  // Efecto del scroll
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);


  // Función para enviar mensajes
  const sendMessage = async () => {
    if (!inputText.trim()) return; // No se envia mensajes vacios

    // Mensaje del usuario a la lista
    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText(""); // Limpia entrada de texto
    setIsTyping(true); // Estado escribiendo..

    try {
      // Obtine recomendación de la api
      const response = await getAutoRecommendation(inputText);
      setTimeout(() => {
        setIsTyping(false);
        // Agregar mensjae de respuesta del bot
        setMessages((prev) => [...prev, { sender: "bot", text: response.sugerencias }]);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error al comunicarse con el servidor." }]);
    }
  };


  // Función para copiar texto
  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    ToastAndroid.show("Texto copiado al portapapeles", ToastAndroid.SHORT);
  };

  // Función para activar de texto a voz
  const toggleSpeakMessage = (text) => {
    if (isSpeaking) {
      Speech.stop(); // Detener si esta hablando
      setIsSpeaking(false);
    } else {
      Speech.speak(text, {
        language: "es",
        pitch: 1, // tono de voz
        rate: 1, //Velocidad
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };


  // Función para agregar mensajes en la posición que corresponda
  const renderMessage = ({ item }) => (
    <View className={`flex-row items-start mb-2 ${item.sender === "user" ? "justify-end" : "justify-start"}`}>
      {item.sender === "bot" && (
        <Image source={BOT_IMAGE} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 6 }} />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", maxWidth: "75%" }}>
        <View
          style={{
            padding: 10,
            borderRadius: 18,
            backgroundColor: item.sender === "user" ? "#3b3033" : "#38303B",
            borderWidth: 1,
            borderColor: item.sender === "user" ? "#2A1943" : "#0583F2",
            alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
            flexShrink: 1,
          }}
        >
          {item.sender === "bot" && !item.isTyping && (
            <Text style={{ color: "#a1a1aa", fontSize: 14, marginBottom: 2 }}>AIDrive</Text>
          )}
          {item.isTyping ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={{ color: "white", fontSize: 12, marginLeft: 4 }}>AIDrive está escribiendo...</Text>
            </View>
          ) : (
            <Text style={{ color: "white", fontSize: 13 }}>{item.text}</Text>
          )}
        </View>
        {item.sender === "bot" && !item.isTyping && (
          <View style={{ flexDirection: "column", alignItems: "center", alignSelf: "center", marginLeft: 12 }}>
            <TouchableOpacity onPress={() => toggleSpeakMessage(item.text)} style={{ padding: 4, backgroundColor: "#8A76B5", borderRadius: 5, width: 22, height: 22, justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
              <Ionicons name={isSpeaking ? "volume-mute" : "volume-high"} size={14} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(item.text)} style={{ padding: 4, backgroundColor: "#8A76B5", borderRadius: 5, width: 22, height: 22, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="copy" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a2e]">
      <LinearGradient colors={["#2E1E42", "#3F2C59", "#1F1724"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="pb-4 rounded-b-2xl shadow-lg">
        <View className="flex-row items-center justify-between px-4 pt-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">AIDrive</Text>
          <TouchableOpacity className="p-1">
            <Ionicons name="ellipsis-horizontal" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {/* 🔹 AGREGADO: Slogan debajo del título */}
        <View className="items-center mt-1">
          <Text className="text-white text-sm opacity-75">Conduce tus sueños, hazlos realidad...</Text>
        </View>
      </LinearGradient>
      <FlatList 
      ref={flatListRef} 
      data={messages.concat(isTyping ? [{ sender: "bot", text: "escribiendo...", isTyping: true }] : [])} 
      keyExtractor={(item, index) => index.toString()} renderItem={renderMessage} 
      className="flex-1 px-3 py-1" contentContainerStyle={{ paddingTop: 14 }}/>
      <View className="flex-row items-center px-4 py-3 mx-4 mb-4 bg-[#2e2e52] rounded-full shadow-md">
        <TextInput className="flex-1 px-4 py-2 text-white text-md bg-[#4e4e7a] rounded-full" placeholder="Escribe tu mensaje..." placeholderTextColor="#aaaaaa" value={inputText} onChangeText={setInputText} />
        <TouchableOpacity onPress={sendMessage} className="ml-3 p-3 bg-[#007aff] rounded-full">
          <Ionicons name="send" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AsistenteVirtual;

