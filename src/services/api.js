// src/services/api.js
const API_BASE_URL = 'http://192.168.0.7:8000';
export const getAutoRecommendation = async (texto) => {
  const url = 'http://192.168.0.7:8000/recomendar';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texto }),
  });

  if (!response.ok) {
    throw new Error('Error al obtener respuesta del Asistente Virtual');
  }

  const data = await response.json();
  //console.log("Respuesta de la API:", data); // 

  return data;
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
    
    const responseData = await response.json();  // Guardamos los datos de la respuesta

    console.log('Respuesta de la API:', responseData); // Imprimimos la respuesta en consola
    
    return responseData;  // Retornamos los datos para usarlos en el componenter
    //return response.json(); // Devuelve los datos para ser usados en el componente
  } catch (error) {
    console.error("Error al llamar la API:", error);
    throw error; // Relanza el error para manejarlo en el componente
  }
};
