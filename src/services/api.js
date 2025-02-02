export const getAutoRecommendation = async (texto) => {
  const url = 'http://192.168.0.6:8000/recomendar';
  const response = await fetch(url, {
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
