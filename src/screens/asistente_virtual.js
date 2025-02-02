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
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { getAutoRecommendation } from "../services/api";

const BOT_IMAGE = require("../../assets/perfil_av.png");

const AsistenteVirtual = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [speakingMessage, setSpeakingMessage] = useState(null); // Control individual de cada mensaje
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await getAutoRecommendation(inputText);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: response.sugerencias }]);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error al comunicarse con el servidor." }]);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    ToastAndroid.show("Texto copiado al portapapeles", ToastAndroid.SHORT);
  };

  const toggleSpeakMessage = (text, index) => {
    if (speakingMessage === index) {
      Speech.stop();
      setSpeakingMessage(null);
    } else {
      Speech.speak(text, {
        language: "es",
        pitch: 1,
        rate: 1,
        onDone: () => setSpeakingMessage(null),
        onStopped: () => setSpeakingMessage(null),
      });
      setSpeakingMessage(index);
    }
  };

  const renderMessage = ({ item, index }) => (
    <View style={{ flexDirection: item.sender === "user" ? "row-reverse" : "row", marginVertical: 6, paddingHorizontal: 12 }}>
      {item.sender === "bot" && (
        <Image source={BOT_IMAGE} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 6 }} />
      )}
      <View style={{ backgroundColor: item.sender === "user" ? "#3b3033" : "#38303B", padding: 10, borderRadius: 10, maxWidth: "75%" }}>
        {item.sender === "bot" && !item.isTyping && (
          <Text style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 4 }}>AIDrive</Text>
        )}
        {item.isTyping ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={{ color: "white", fontSize: 12, marginLeft: 4 }}>AIDrive está escribiendo...</Text>
          </View>
        ) : (
          <Text style={{ color: "white", fontSize: 14 }}>{item.text}</Text>
        )}

        {/* Botones de Voz y Copiar */}
        {item.sender === "bot" && !item.isTyping && (
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 5 }}>
            <TouchableOpacity onPress={() => toggleSpeakMessage(item.text, index)} style={{ marginRight: 10 }}>
              <Ionicons name={speakingMessage === index ? "volume-mute" : "volume-high"} size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(item.text)}>
              <Ionicons name="copy" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a2e" }}>
      {/* Encabezado con Gradiente */}
      <LinearGradient
        colors={["#2E1E42", "#3F2C59", "#1F1724"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingBottom: 16, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, elevation: 4 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 32 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>AIDrive</Text>
          <TouchableOpacity style={{ padding: 8 }}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginTop: 4 }}>
          <Text style={{ color: "white", fontSize: 14, opacity: 0.75 }}>Conduce tus sueños, hazlos realidad...</Text>
        </View>
      </LinearGradient>

      {/* Lista de mensajes */}
      <FlatList 
        ref={flatListRef} 
        data={messages.concat(isTyping ? [{ sender: "bot", text: "escribiendo...", isTyping: true }] : [])} 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={renderMessage} 
        contentContainerStyle={{ paddingTop: 14 }}
      />

      {/* Barra de entrada de texto */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#2e2e52", borderRadius: 50, margin: 16 }}>
        <TextInput
          style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8, color: "white", backgroundColor: "#4e4e7a", borderRadius: 50 }}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#aaaaaa"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 12, padding: 12, backgroundColor: "#007aff", borderRadius: 50 }}>
          <Ionicons name="send" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AsistenteVirtual;
