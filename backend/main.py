import os
import requests
import numpy as np
import cv2
import easyocr
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Omni-Scan AI - Ndiaye Adama Tech Engine")

# --- SÉCURITÉ ---
# Clé API SerpApi de Ndiaye Adama Tech (Sécurisée via Vercel en prod)
SERP_API_KEY = os.getenv("SERPAPI_KEY", "2f7c6165d1cf88ba290e1d566cd733cc04d7f2fe6d82c24396df55e6a59f7d8c")

# Initialisation du moteur OCR (Français, Anglais)
# Note: EasyOCR télécharge des modèles légers au premier lancement
reader = easyocr.Reader(['fr', 'en'], gpu=False) # Désactiver GPU si pas dispo sur le serveur

# Autoriser les requêtes CORS depuis le frontend (Next.js/Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductResponse(BaseModel):
    title: str
    price: str
    source: str
    link: str
    thumbnail: str = None
    confidence: float
    message: str

@app.get("/")
async def root():
    return {
        "status": "Online",
        "engine": "Omni-Scan AI Core",
        "responsible": "Ndiaye Adama Tech",
        "region": "Côte d'Ivoire 🇨🇮"
    }

def get_market_price_ci(product_query):
    """Interroge Google Shopping via SerpApi pour des prix localisés en CI."""
    url = "https://serpapi.com/search"
    params = {
        "engine": "google_shopping",
        "q": product_query,
        "hl": "fr",
        "gl": "ci", # Localisation stricte Côte d'Ivoire
        "api_key": SERP_API_KEY
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if "shopping_results" in data and data["shopping_results"]:
            best_match = data["shopping_results"][0] # Le premier résultat est souvent le meilleur
            return {
                "title": best_match.get("title", "Nom inconnu"),
                "price": best_match.get("price", "Prix non affiché"),
                "source": best_match.get("source", "Boutique inconnue"),
                "link": best_match.get("link", "#"),
                "thumbnail": best_match.get("thumbnail")
            }
    except Exception as e:
        print(f"Erreur API SerpApi : {e}")
        return None
    
    return None

@app.post("/api/scan", response_model=ProductResponse)
async def scan_product(file: UploadFile = File(...)):
    # Vérification format d'image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Veuillez uploader une image valide.")
        
    try:
        # 1. Lecture de l'image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # 2. Prétraitement léger
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 3. Extraction du texte (Marque/Produit)
        ocr_results = reader.readtext(gray)
        # On concatène les 3 premiers blocs de texte détectés pour former le nom
        detected_text = " ".join([res[1] for res in ocr_results[:3]])
        confidence_ocr = np.mean([res[2] for res in ocr_results[:3]]) if ocr_results else 0.0
        
        if not detected_text or len(detected_text) < 3:
             return ProductResponse(
                title="Produit non identifié",
                price="--",
                source="Inconnue",
                link="#",
                confidence=0.0,
                message="Impossible de lire le texte sur l'image."
            )
            
        # 4. Recherche de Prix Réel
        market_data = get_market_price_ci(detected_text)
        
        if market_data:
            return ProductResponse(
                title=market_data["title"],
                price=market_data["price"],
                source=market_data["source"],
                link=market_data["link"],
                thumbnail=market_data["thumbnail"],
                confidence=confidence_ocr,
                message="Produit trouvé sur le marché 🇨🇮."
            )
        else:
            return ProductResponse(
                title=f"'{detected_text}'",
                price="Indisponible",
                source="Marché en ligne",
                link="#",
                confidence=confidence_ocr,
                message="Aucun prix exact trouvé pour ce nom."
            )
            
    except Exception as e:
        print(f"Erreur interne : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse : {str(e)}")

# Pour lancer localement : uvicorn main:app --reload --port 8000
