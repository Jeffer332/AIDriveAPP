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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display"; // Importa el Markdown
import { getAutoRecommendation } from "../services/api";

const BOT_IMAGE = require("../../assets/perfil_av.png");

const AsistenteVirtual = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [speakingMessage, setSpeakingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await getAutoRecommendation(inputText);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.sugerencias },
        ]);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al comunicarse con el servidor." },
      ]);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    ToastAndroid.show("Texto copiado al portapapeles", ToastAndroid.SHORT);
  };

  // Función para limpiar el texto antes de hablar
  const cleanMarkdownForSpeech = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Quita **negrita**
      .replace(/\*(.*?)\*/g, "$1") // Quita *cursiva*
      .replace(/^[-•*]\s+/gm, "") // Quita viñetas
      .replace(/\n/g, " "); // Quita saltos de línea
  };

  const toggleSpeakMessage = (text, index) => {
    if (speakingMessage === index) {
      Speech.stop();
      setSpeakingMessage(null);
    } else {
      const cleanText = cleanMarkdownForSpeech(text);
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

  const renderMessage = ({ item, index }) => (
    <View className={`flex-row ${item.sender === "user" ? "flex-row-reverse" : ""} my-2 px-3`}>
      {item.sender === "bot" && (
        <Image source={BOT_IMAGE} className="w-7 h-7 rounded-full mr-2" />
      )}
      <View className={`p-3 rounded-lg ${item.sender === "user" ? "max-w-[75%]" : "w-[75%]"} ${item.sender === "user" ? "bg-[#3b3033]" : "bg-[#38303B]"}`}>

        {item.sender === "bot" && !item.isTyping && (
          <Text className="text-xs text-gray-400 mb-1">AIDrive</Text>
        )}
        {item.isTyping ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#ffffff" />
            <Text className="text-xs text-white ml-2">AIDrive está escribiendo...</Text>
          </View>
        ) : (
          // Muestra el mensaje con Markdown
          <Markdown style={{ body: { color: "white", fontSize: 12 } }}>
            {item.text}
          </Markdown>
        )}

        {item.sender === "bot" && !item.isTyping && (
          <View className="flex-row justify-end mt-2">
            <TouchableOpacity onPress={() => toggleSpeakMessage(item.text, index)} className="mr-3">
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className="flex-1 bg-[#1a1a2e]"
    >
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={["#2E1E42", "#3F2C59", "#1F1724"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pb-2 rounded-b-xl shadow-md"
        >
          <View className="flex-row justify-between px-3 pt-12">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-white text-sm font-bold">AIDrive</Text>
            <TouchableOpacity className="p-2">
              <Ionicons name="ellipsis-horizontal" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View className="items-center -mt-2">
            <Text className="text-gray-300 text-xs opacity-90">Conduce tus sueños, hazlos realidad...</Text>
          </View>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={messages.concat(isTyping ? [{ sender: "bot", text: "escribiendo...", isTyping: true }] : [])}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        <View className="flex-row items-center px-4 py-3 bg-[#2e2e52] rounded-full m-4">
          <TextInput
            className="flex-1 px-4 py-3 text-white bg-[#4e4e7a] rounded-full text-xs"
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#aaaaaa"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} disabled={isTyping} className="ml-3 p-3 bg-[#007aff] rounded-full">
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AsistenteVirtual;
