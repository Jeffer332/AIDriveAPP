# backend/firebase_config.py
import firebase_admin
from firebase_admin import credentials, db
import os

# Ruta del archivo JSON de Firebase
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_key.json")

# Inicializar Firebase (evita inicializar múltiples veces)
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://aidriveapp-default-rtdb.firebaseio.com/'
    })

def get_autos_data():
    """Obtiene los autos almacenados en Firebase Realtime Database"""
    ref = db.reference("autos")  # Ruta en Firebase donde están los autos
    autos_data = ref.get()  # Obtiene todos los autos
    return autos_data  # Devuelve los autos en formato JSON
