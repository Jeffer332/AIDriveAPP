// src/services/chat_service.js
// manejar los mensajes en Firestore.
import { db } from "./firebase";
import { doc, updateDoc, setDoc, arrayUnion, onSnapshot } from "firebase/firestore";

// 🔹 Función para guardar mensajes en Firestore
export const saveMessageToFirestore = async (userId, message) => {
  const chatRef = doc(db, "chats", userId);
  
  try {
    await updateDoc(chatRef, {
      messages: arrayUnion(message), // Agrega el nuevo mensaje sin sobrescribir
    });
  } catch (error) {
    // Si el documento no existe, lo creamos con el primer mensaje
    if (error.code === "not-found") {
      await setDoc(chatRef, { messages: [message] });
    } else {
      console.error("Error guardando mensaje:", error);
    }
  }
};

//Función para escuchar mensajes en tiempo real en Firestore
export const loadMessagesFromFirestore = (userId, setMessages) => {
  const chatRef = doc(db, "chats", userId);

  return onSnapshot(chatRef, (docSnap) => {
    if (docSnap.exists()) {
      setMessages(docSnap.data().messages || []);
    } else {
      setMessages([]); // Si no hay mensajes, inicia con un array vacío
    }
  });
};