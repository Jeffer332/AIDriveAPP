//src/screens/asistente_virtual.js
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
  Keyboard,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { getAutoRecommendation } from "../services/api";
import {
  saveMessageToFirestore,
  loadMessagesFromFirestore,
} from "../services/chat_service"; //función para guardar en Firestore
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth"; // 🔹 Importar la función correcta
import { useRoute } from "@react-navigation/native";

const BOT_IMAGE = require("../../assets/perfil_av.png");

const AsistenteVirtual = ({ navigation }) => {
  const [messages, setMessages] = useState([]); // Almacena los mensajes del chat
  const [inputText, setInputText] = useState(""); // Estado del input de texto
  const [speakingMessage, setSpeakingMessage] = useState(null); // Estado para el mensaje en reproducción de voz
  const [isTyping, setIsTyping] = useState(false); // Estado para indicar si el bot está escribiendo
  const flatListRef = useRef(null); // Referencia a la lista de mensajes para el autoscroll
  const route = useRoute();

  //recuperación de la información de la cámara
  useEffect(() => {
    // Recupera la respuesta de la API enviada desde CameraScreen
    if (route.params?.autoDetectado) {
      const {mensaje, detalles} = route.params.autoDetectado;
      
      //agregamos automáticamente el mensaje del usuario
      const userMessage = {
        sender: "user",
        text: mensaje,
        timestamp: new Date().toString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      //simulamos el envío del mensaje llenado automático autmático
      setInputText(mensaje);
      sendMessage();
    }
  }, [route.params?.autoDetectado]);

  // Escuchar mensajes desde Firestore cuando el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // 🔹 Escuchar cambios en tiempo real de Firestore
        return loadMessagesFromFirestore(currentUser.uid, setMessages);
      }
    });

    return () => unsubscribe(); // Cleanup al salir de la pantalla
  }, []);

  // Efecto para hacer scroll automático al final cuando hay nuevos mensajes
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  // Función para enviar un mensaje
  const sendMessage = async (customMessage = null) => {
    
    //conatante para recibir emnsaje de forma programática desde la cámara
    const messageToSend = customMessage || inputText;

    if (!messageToSend.trim() || isTyping) return; // Evitar envíos vacíos

    const user = auth.currentUser; // 🔹 Obtener usuario autenticado
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    const userMessage = {
      sender: "user",
      text: messageToSend,
      timestamp: new Date().toISOString(),
    };

    // 🔹 Agregar el mensaje del usuario a la lista de mensajes en pantalla
    setMessages((prev) => [...prev, userMessage]);

    // 🔹 Guardar mensaje del usuario en Firestore
    await saveMessageToFirestore(user.uid, userMessage);

    setInputText("");
    setIsTyping(true);

    try {
      // Llamar a la API para obtener la respuesta del asistente virtual
      const response = await getAutoRecommendation(messageToSend);
      const botMessage = {
        sender: "bot",
        text: response.sugerencias,
        autos: response.autos || [],
        timestamp: new Date().toISOString(),
      };

      setTimeout(async () => {
        setIsTyping(false);
        setMessages((prev) => [...prev, botMessage]);

        // 🔹 Guardar respuesta del bot en Firestore
        await saveMessageToFirestore(user.uid, botMessage);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al comunicarse con el servidor." },
      ]);
    }
  };

  // Función para copiar texto al portapapeles
  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    ToastAndroid.show("Texto copiado al portapapeles", ToastAndroid.SHORT);
  };

  // Función para limpiar el texto antes de convertirlo en voz
  const cleanMarkdownForSpeech = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Elimina **negritas**
      .replace(/\*(.*?)\*/g, "$1") // Elimina *cursivas*
      .replace(/^[-•*]\s+/gm, "") // Elimina viñetas
      .replace(/\n/g, " "); // Sustituye saltos de línea por espacios
  };

  // Función para alternar la reproducción de voz del mensaje
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
      setSpeakingMessage(index === speakingMessage ? null : index);
    }
  };

  // Función para renderizar cada mensaje en la lista
  const renderMessage = ({ item, index }) => (
    <View
      className={`flex-row ${
        item.sender === "user" ? "flex-row-reverse" : ""
      } my-2 px-3`}
    >
      {/* Imagen del asistente virtual */}
      {item.sender === "bot" && (
        <Image source={BOT_IMAGE} className="w-7 h-7 rounded-full mr-2" />
      )}
      {/* Contenedor del mensaje */}
      <View
        className={`p-3 rounded-lg ${
          item.sender === "user" ? "max-w-[75%]" : "w-[75%]"
        } ${item.sender === "user" ? "bg-[#3b3033]" : "bg-[#38303B]"}`}
      >
        {/* Nombre del bot si el mensaje es del asistente virtual */}
        {item.sender === "bot" && !item.isTyping && (
          <Text className="text-xs text-gray-400 mb-1">AIDrive</Text>
        )}

        {item.isTyping ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#ffffff" />
            <Text className="text-xs text-white ml-2">
              AIDrive está escribiendo...
            </Text>
          </View>
        ) : (
          // Muestra el mensaje con formato Markdown
          <Markdown style={{ body: { color: "white", fontSize: 12 } }}>
            {item.text}
          </Markdown>
        )}

        {/* Botones de voz y copiar si el mensaje es del bot */}
        {item.sender === "bot" && !item.isTyping && (
          <View className="flex-row justify-end mt-2">
            <TouchableOpacity
              onPress={() => toggleSpeakMessage(item.text, index)}
              className="mr-3"
            >
              <Ionicons
                name={speakingMessage === index ? "volume-high" : "volume-mute"}
                size={18}
                color="#ffffff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(item.text)}>
              <Ionicons name="copy" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/*Mostrar múltiples imágenes cuando haya varias recomendaciones */}
        {item.autos &&
          item.autos.length > 0 &&
          item.autos.map((auto, i) => (
            <View key={i} className="mt-2">
              <Text className="text-xs text-white font-bold">
                {auto.nombre}
              </Text>
              <Text className="text-xs text-gray-300">{auto.descripcion}</Text>
              {auto.imagen_url && auto.imagen_url.startsWith("http") && (
                <Image
                  source={{ uri: auto.imagen_url }}
                  style={{
                    width: 250,
                    height: 150,
                    borderRadius: 10,
                    marginTop: 5,
                  }}
                  resizeMode="cover"
                />
              )}
            </View>
          ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      //keyboardVerticalOffset={Platform.OS === "ios" ? 2 : 0}
      className="flex-1 bg-[#1a1a2e]"
    >
      <SafeAreaView className="flex-1">
        {/* Encabezado con gradiente */}
        <LinearGradient
          colors={["#2E1E42", "#3F2C59", "#1F1724"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="pb-2 rounded-b-xl shadow-md"
        >
          <View className="flex-row justify-between px-3 pt-12">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2"
            >
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-white text-sm font-bold">AIDrive</Text>
            <TouchableOpacity className="p-2">
              <Ionicons name="ellipsis-horizontal" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View className="items-center -mt-2">
            <Text className="text-gray-300 text-xs opacity-90">
              Conduce tus sueños, hazlos realidad...
            </Text>
          </View>
        </LinearGradient>

        {/* Lista de mensajes */}
        <FlatList
          ref={flatListRef}
          data={messages.concat(
            isTyping
              ? [{ sender: "bot", text: "escribiendo...", isTyping: true }]
              : []
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        {/* Barra de entrada de texto */}
        <View className="flex-row items-center px-4 py-3 bg-[#2e2e52] rounded-full m-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Camera')}
            className="mr-3 p-3 rounded-full bg-[#4e4e7a]"
          >
            <Ionicons name="camera" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 px-4 py-3 text-white bg-[#4e4e7a] rounded-full text-xs"
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#aaaaaa"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            onPress={() => {
              sendMessage();
              Keyboard.dismiss(); // Cierra el teclado al enviar el mensaje
            }}
            disabled={!inputText.trim() || isTyping}
            className={`ml-3 p-3 rounded-full ${
              !inputText.trim() || isTyping
                ? "bg-gray-500 opacity-50"
                : "bg-[#007aff]"
            }`}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AsistenteVirtual;
