import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

// Configuration de la caméra mobile (arrière)
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Caméra arrière par défaut
};

const Scanner = () => {
    const webcamRef = useRef(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction de capture et d'envoi de l'image
    const captureAndScan = useCallback(async () => {
        setLoading(true);
        setResult(null);
        setError(null);
        
        // Obtenir le screenshot en base64
        const imageSrc = webcamRef.current.getScreenshot();
        
        if (!imageSrc) {
            setError("Impossible d'accéder à la caméra.");
            setLoading(false);
            return;
        }

        try {
            // Conversion base64 en Blob pour l'envoi multipart/form-data
            const blob = await (await fetch(imageSrc)).blob();
            const formData = new FormData();
            formData.append('file', blob, 'scan.jpg');

            // --- IMPORTANT : AJUSTER L'URL DU BACKEND POUR LA PROD ---
            // Local: http://localhost:8000/api/scan
            // Vercel Prod: https://votre-backend.vercel.app/api/scan
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            
            const response = await fetch(`${backendUrl}/api/scan`, {
                method: 'POST',
                body: formData,
                // Ne pas mettre de headers Content-Type, FormData le gère
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erreur lors du scan.');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message || "Une erreur inconnue est survenue.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [webcamRef]);

    return (
        <div className="flex flex-col items-center w-full max-w-2xl p-4 mx-auto">
            {/* Zone Caméra */}
            <div className="relative w-full overflow-hidden border-4 border-gray-900 rounded-3xl aspect-video bg-black shadow-inner">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="object-cover w-full h-full"
                />
                
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 text-white p-4 text-center">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl font-bold">Analyse en cours...</p>
                        <p className="text-sm opacity-80">Moteur Ndiaye Adama Tech</p>
                    </div>
                )}

                {/* Grille de ciblage style professionnel */}
                <div className="absolute inset-0 border-2 border-white/20 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-r border-b border-white/10"></div>
                    <div className="border-b border-white/10"></div>
                    <div className="border-r border-white/10"></div>
                    <div className="border-r border-white/10"></div>
                    <div></div>
                </div>
            </div>

            {/* Bouton d'action */}
            <button
                onClick={captureAndScan}
                disabled={loading}
                className={`w-full mt-6 px-8 py-5 text-xl font-black text-white rounded-2xl shadow-xl transition-all duration-300 transform 
                ${loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 via-white to-green-500 hover:from-orange-600 hover:to-green-600 active:scale-95'}`}
            >
                {loading ? "ANALYSE..." : "SCANNER PRODUIT 🇨🇮"}
            </button>

            {/* Affichage des Erreurs */}
            {error && (
                <div className="w-full mt-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-900 rounded-lg shadow-md">
                    <p className="font-bold">⚠️ Erreur</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Zone Résultat */}
            {result && (
                <div className="w-full mt-6 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 transform transition-all duration-500 opacity-100 scale-100">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {result.thumbnail && (
                            <img 
                                src={result.thumbnail} 
                                alt={result.title} 
                                className="w-full sm:w-32 h-32 object-contain rounded-xl border border-gray-100 bg-gray-50"
                            />
                        )}
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-green-800 bg-green-100 rounded-full">
                                {result.message}
                            </span>
                            <h2 className="text-2xl font-extrabold text-gray-950 mb-1">{result.title}</h2>
                            <p className="text-sm text-gray-500 mb-4">Moteur Ndiaye Adama Tech | Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                            
                            <div className="flex items-end justify-between gap-4 mt-2">
                                <div className="p-3 bg-gray-50 rounded-xl flex-1">
                                    <p className="text-xs text-gray-500">Meilleur Prix 🇨🇮</p>
                                    <p className="text-3xl font-black text-orange-600">{result.price}</p>
                                    <p className="text-xs text-gray-400">sur {result.source}</p>
                                </div>
                                {result.link && result.link !== "#" && (
                                    <a 
                                        href={result.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-700 transition"
                                    >
                                        Voir Offre
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;
