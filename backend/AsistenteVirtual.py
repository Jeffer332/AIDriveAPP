# backend/AsistenteVirtual.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from dotenv import load_dotenv
import os
import json
import uvicorn

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

# Obtener la ruta absoluta del archivo actual (AsistenteVirtual.py)
base_dir = os.path.dirname(os.path.abspath(__file__))  # Obtiene el directorio donde está el archivo AsistenteVirtual.py

# Crear la ruta completa hacia el archivo autos_ficha_tecnica.csv dentro de la carpeta 'datos_autos'
csv_file = os.path.join(base_dir, 'datos_autos', 'autos_ficha_tecnica.csv')  # Combina el directorio base con la carpeta y el archivo CSV


# Cargar datos del CSV en memoria
#csv_file = "../autos_ficha_tecnica.csv"
try:
    df = pd.read_csv(csv_file)
except FileNotFoundError:
    raise Exception(f"No se encontró el archivo CSV en la ruta: {csv_file}")
except pd.errors.EmptyDataError:
    raise Exception(f"El archivo CSV está vacío: {csv_file}")

# Cargar API Key de Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("La clave de API de Gemini no se encuentra en el archivo .env.")

genai.configure(api_key=GOOGLE_API_KEY)

# Modelo de datos para solicitud y respuesta
class AutoRequest(BaseModel):
    texto: str

class AutoResponse(BaseModel):
    sugerencias: str

@app.get("/")
def read_root():
    return {"mensaje": "API de Asistente Virtual para Vehículos funcionando correctamente"}


@app.post("/recomendar", response_model=AutoResponse)
async def recomendar_auto(request: AutoRequest):
    user_input = request.texto.strip()
    
    if not user_input:
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío.")

    # Convertir todo el CSV a formato JSON
    autos_data_json = df.to_dict(orient="records")  
    autos_data_str = json.dumps(autos_data_json, ensure_ascii=False)

    system_prompt = """
    Eres un asesor experto y vendedor de autos. Un usuario te dijo: '{user_input}'.
    Usa los datos disponibles para recomendar el mejor vehículo filtrando por preferencias y características que te indica el usuario.
    Si no encuentras alternativas exactas, sugiere otras muy parecidas.
    Genera una respuesta clara y corta con recomendaciones útiles.
    Autos disponibles:
    {available_cars}
    """

    final_prompt = system_prompt.format(user_input=user_input, available_cars=autos_data_str)

    try:
        # Configurar el modelo con los parámetros correctos
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        response = model.generate_content(
            final_prompt,
            generation_config={  #Parámetros de control de generación
                "temperature": 0.8,  # Controla la creatividad
                "max_output_tokens": 1000,  # Longitud de la respuesta
                "top_p": 0.9,  # Control de aleatoriedad
                "top_k": 40  # Filtro de palabras más probables
            }
        )
        
        resultado = response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al comunicarse con Gemini: {str(e)}")

    return AutoResponse(sugerencias=resultado)
# Configuración de ejecución del servidor con IP y puerto específicos
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

