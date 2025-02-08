const API_BASE_URL = "http://192.168.3.2:8000";
export const getAutoRecommendation = async (texto) => {
  //const url = 'http://192.168.100.8:8000/recomendar';
  const response = await fetch(`${API_BASE_URL}/recomendar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texto }),
  });

  if (!response.ok) {
    throw new Error('Error al obtener respuesta del chatbot');
  }

  return response.json();
};

// Función movida desde CameraScreen.js
export const uploadImageToAPI = async (imageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload_image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    return response.json(); // Devuelve los datos para ser usados en el componente
  } catch (error) {
    console.error("Error al llamar la API:", error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};
