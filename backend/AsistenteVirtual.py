# backend/AsistenteVirtual.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json
import uvicorn
from firebase_config import get_autos_data  # Importamos la función para obtener autos desde Firebase

# Cargar variables de entorno
load_dotenv()

# Configuración de la API
app = FastAPI(title="AIDrive: Asistente Virtual de Autos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar API Key de Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("La clave de API de Gemini no se encuentra en el archivo .env.")

genai.configure(api_key=GOOGLE_API_KEY)

# 🔹 Definir AutoRequest antes de usarlo
class AutoRequest(BaseModel):
    texto: str

class Auto(BaseModel):
    nombre: str
    descripcion: str
    imagen_url: str | None = None
    puntos_a_considerar: str  # Nuevo campo agregado

class AutoResponse(BaseModel):
    sugerencias: str
    autos: list[Auto]

@app.post("/recomendar", response_model=AutoResponse)
async def recomendar_auto(request: AutoRequest):
    user_input = request.texto.strip()
    
    if not user_input:
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío.")

    # Obtener los datos desde Firebase
    autos_data_json = get_autos_data()
    
    if not autos_data_json:
        return AutoResponse(sugerencias="No hay autos en la base de datos.", autos=[])

    autos_data_str = json.dumps(autos_data_json, ensure_ascii=False)

    system_prompt = """
    Eres un asesor experto en autos. Un usuario te preguntó: '{user_input}'.
    Usa los datos disponibles para recomendar los mejores vehículos según sus preferencias.
    Si no hay coincidencias exactas, sugiere opciones similares.
    Devuelve la respuesta en este formato JSON:

    {{
      "sugerencias": "Texto con la recomendación de los autos.",
      "autos": [
        {{
          "nombre": "Nombre del auto recomendado",
          "descripcion": "Breve descripción del auto",
          "imagen_url": "URL de la imagen del auto recomendado",
          "puntos_a_considerar": "Aconseja al usuario de manera clara en base a los problemas técnicos, comerciales, y quejas mas comunes que presentan
           otros usuarios de esta marca y modelo de automóvil"
        }},
        {{
          "nombre": "Nombre del segundo auto",
          "descripcion": "Descripción del segundo auto",
          "imagen_url": "URL de la imagen del segundo auto",
          "puntos_a_considerar": "Aconseja al usuario de manera clara en base a los problemas técnicos, comerciales, y quejas mas comunes que presentan
           otros usuarios de esta marca y modelo de automóvil"
        }}
      ]
    }}

    Autos disponibles:
    {available_cars}
    """

    final_prompt = system_prompt.format(user_input=user_input, available_cars=autos_data_str)

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            final_prompt,
            generation_config={
                "temperature": 0.8,
                "max_output_tokens": 1000,
                "top_p": 0.9,
                "top_k": 40
            }
        )

        if not response.text.strip():
            raise ValueError("La respuesta de Gemini está vacía.")

        try:
            json_response = json.loads(response.text.strip().replace("```json", "").replace("```", ""))  # Convertir respuesta a JSON
        except json.JSONDecodeError:
            raise ValueError(f"Respuesta no válida de Gemini: {response.text.strip()}")

        sugerencias = json_response.get("sugerencias", "No se pudo generar una recomendación.")
        autos = json_response.get("autos", [])

    except Exception as e:
        sugerencias = "Parece que hubo un error al procesar tu solicitud. Intenta nuevamente."
        autos = []

    return AutoResponse(sugerencias=sugerencias, autos=autos)



# cargar la imagen para que funcione el reconocimiento del vehículo
class ImageData(BaseModel):
    image: str  # Imagen en formato base64

@app.post("/upload_image")
def upload_image(data: ImageData):
    modelo = genai.GenerativeModel('gemini-1.5-pro-latest')
    image_data = data.image.split(';base64,')[-1]  # Extrae la parte base64
    
    image_content = {"inline_data": {"mime_type": "image/png", "data": image_data}}

    # Enviar la imagen a Gemini para detección de vehículos
    text_prompt = "¿La imagen proporcionada contiene un vehículo? Responde con 'sí' o 'no'."
    response = modelo.generate_content([{"text": text_prompt},image_content])
    print(response)

    if "no" in response.text.lower():
        return {"mensaje": "La imagen no es un vehículo"}
    
    description_prompt = """Identifica el vehículo de la imagen y proporciona los siguientes datos en formato JSON:
              {
                "marca": "Marca del vehículo",
                "modelo": "Modelo del vehículo",
                "año": "Año aproximado del vehículo"
              }
              """
    description_response = modelo.generate_content([{"text": description_prompt},image_content ])
    json_text = description_response.parts[0].text
    json_string = json_text.replace("```json", "").replace("```", "")
    print(json_string)
    return {"descripcion": json_string}

# Configuración de ejecución del servidor con IP y puerto específicos
if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8000)

