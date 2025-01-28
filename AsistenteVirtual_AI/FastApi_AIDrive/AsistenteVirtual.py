from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configuración inicial de la app FastAPI
app = FastAPI(title="AIDrive: Asistente Virtual de Autos")

# Configuración de CORS para permitir acceso desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar datos del CSV
csv_file = "C:/Users/paote/AsistenteVirtual_AI/FastApi_AIDrive/datos_autos/autos_ficha_tecnica.csv"
try:
    df = pd.read_csv(csv_file)
except FileNotFoundError:
    raise Exception(f"No se encontró el archivo CSV en la ruta: {csv_file}")
except pd.errors.EmptyDataError:
    raise Exception(f"El archivo CSV está vacío: {csv_file}")

# Configurar Google Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("La clave de API de Gemini no se encuentra en el archivo .env.")

genai.configure(api_key=GOOGLE_API_KEY)

# Modelos de datos para las solicitudes y respuestas
class AutoRequest(BaseModel):
    texto: str

class AutoResponse(BaseModel):
    sugerencias: str

@app.get("/")
def read_root():
    return {"mensaje": "API de Asistente Virtual para Vehículos funcionando correctamente"}


@app.post("/recomendar", response_model=AutoResponse)
async def recomendar_auto(request: AutoRequest):
    # Validar que el texto no esté vacío
    if not request.texto.strip():
        raise HTTPException(status_code=400, detail="El texto no puede estar vacío.")

    # Prompt inicial para Gemini
    system_prompt = """
    Eres un asesor experto vendedor de autos. Un usuario te dijo: '{user_input}'.
    Usa los datos disponibles para recomendar el mejor vehículo filtrando por preferencias y caracteristicas que te indica el usuario.
    Si no encuentras alternativas exactas sugiere otras muy parecidas
    Genera una respuesta clara y corta con recomendaciones útiles.
    Autos disponibles:
    {available_cars}
    """

    # Convertir datos del CSV en texto
    try:
        autos_data = df.to_string(index=False)  # Convertimos todo el CSV en una tabla de texto
    except KeyError:
        raise HTTPException(status_code=500, detail="El archivo CSV no tiene las columnas esperadas.")

    # Reemplazar los placeholders en el prompt
    final_prompt = system_prompt.format(user_input=request.texto, available_cars=autos_data)

    try:
        # Enviar el prompt a Gemini
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=final_prompt)
        response = model.generate_content([{"role": "user", "parts": [final_prompt]}])
        resultado = response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al comunicarse con Gemini: {str(e)}")

    # Devolver la respuesta generada por Gemini directamente
    return AutoResponse(sugerencias=resultado)
