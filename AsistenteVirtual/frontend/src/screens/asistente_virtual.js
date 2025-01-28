import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech'; // Importar Text-to-Speech
import { getAutoRecommendation } from '../services/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // Estado para controlar si el audio está activo

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'user', text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    // Mostrar el indicador de escritura como un mensaje temporal
    const typingMessage = { sender: 'bot', text: 'escribiendo...', isTyping: true };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    try {
      const response = await getAutoRecommendation(inputText);

      // Reemplazar el indicador de escritura con el mensaje del bot
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter((msg) => !msg.isTyping);
          const botMessage = { sender: 'bot', text: response.sugerencias };
          return [...updatedMessages, botMessage];
        });
      }, 1000); // Simular un retraso de 1 segundo
    } catch (error) {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((msg) => !msg.isTyping);
        const errorMessage = { sender: 'bot', text: 'Error al comunicarse con el servidor.' };
        return [...updatedMessages, errorMessage];
      });
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    ToastAndroid.show('Texto copiado al portapapeles', ToastAndroid.SHORT);
  };

  const toggleSpeakMessage = (text) => {
    if (isSpeaking) {
      Speech.stop(); // Detener el audio
      setIsSpeaking(false);
    } else {
      Speech.speak(text, {
        language: 'es', // Idioma español
        pitch: 1, // Tonalidad de la voz
        rate: 1, // Velocidad de lectura
        onDone: () => setIsSpeaking(false), // Cambiar el estado al terminar
        onStopped: () => setIsSpeaking(false), // Cambiar el estado si se detiene manualmente
      });
      setIsSpeaking(true);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageWrapper,
        item.sender === 'user' ? styles.userWrapper : styles.botWrapper,
      ]}
    >
      <View
        style={[
          styles.messageContainer,
          item.sender === 'user' ? styles.userMessage : styles.botMessage,
        ]}
      >
        {item.sender === 'bot' && !item.isTyping && <Text style={styles.botLabel}>AIDrive</Text>}
        {item.isTyping ? (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.typingText}>AIDrive está escribiendo...</Text>
          </View>
        ) : (
          <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
            {item.text}
          </Text>
        )}
      </View>
      {item.sender === 'bot' && !item.isTyping && (
        <View style={styles.botActions}>
          <TouchableOpacity onPress={() => toggleSpeakMessage(item.text)} style={styles.speakerIcon}>
            <Ionicons name={isSpeaking ? 'volume-mute' : 'volume-high'} size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => copyToClipboard(item.text)} style={styles.copyIcon}>
            <Ionicons name="copy" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <LinearGradient
        colors={['#2A1943', '#38303B', '#120A19']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerWrapper}
      >
        <View style={styles.headerContent}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" style={styles.headerIcon} />
          <Text style={styles.headerText}>AIDrive</Text>
          <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff" style={styles.headerIcon} />
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeaderText}>Conduce tus sueños, hazlos realidad...</Text>
        </View>
      </LinearGradient>

      {/* Lista de mensajes */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      />

      {/* Barra de entrada */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={sendMessage}>
          <View style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  headerWrapper: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  headerIcon: {
    padding: 5,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  subHeaderText: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  chatContent: {
    paddingVertical: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  botWrapper: {
    justifyContent: 'flex-start',
  },
  messageContainer: {
    padding: 15,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b3033',
    borderTopRightRadius: 0,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#38303B',
    borderTopLeftRadius: 0,
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
  },
  botLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 5,
  },
  botActions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
  },
  speakerIcon: {
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#8A76B5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIcon: {
    padding: 8,
    backgroundColor: '#8A76B5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#2e2e52',
    elevation: 5,
  },
  textInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 25,
    backgroundColor: '#4e4e7a',
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#007aff',
  },
});

export default ChatBot;
