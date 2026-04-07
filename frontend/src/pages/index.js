import Head from 'next/head'
import Scanner from '@/components/Scanner'

export default function Home() {
  return (
    <>
      <Head>
        <title>Omni-Scan AI 🇨🇮 | Ndiaye Adama Tech | Prix en Temps Réel</title>
        <meta name="description" content="Scanner de produits agricoles, pharmaceutiques et cosmétiques en Côte d'Ivoire. Moteur Ndiaye Adama Tech." />
        <link rel="icon" href="/brand-identity.png" />
      </Head>

      <div className="min-h-screen bg-gray-50 text-gray-950">
        {/* Header Professionnel avec drapeau */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/brand-identity.png" alt="Omni-Scan AI Logo" className="w-10 h-10 rounded-lg shadow" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold tracking-tighter text-gray-950 flex items-center gap-1">
                  Omni-Scan AI <span className="text-3xl">🇨🇮</span>
                </h1>
                <p className="text-xs text-orange-600 font-bold -mt-1">by Ndiaye Adama Tech</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-gray-500">Responsable Technique</span>
              <p className="font-bold text-gray-900">Ndiaye Adama</p>
            </div>
          </nav>
        </header>

        {/* Section Principale */}
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 mb-5 text-sm font-bold text-orange-950 bg-orange-100 rounded-full">
              Scan Professionnel sans Exception
            </span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight max-w-4xl mx-auto">
              Scannez <span className="text-orange-600">N'importe quel</span> Produit. <br />
              Obtenez le Prix Réel en <span className="text-green-600">Côte d'Ivoire 🇨🇮</span>.
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Produits agricoles, pharmaceutiques, cosmétiques ou du quotidien. Identification OCR ultra-réaliste et performance garantie par Ndiaye Adama Tech.
            </p>
          </div>

          {/* Le Scanner */}
          <Scanner />

          {/* Dédicace & Footer */}
          <section className="mt-32 p-10 bg-gray-950 rounded-3xl text-center text-gray-300">
            <p className="text-sm opacity-60">PROJET DÉDICACÉ À</p>
            <p className="text-4xl font-extrabold text-white tracking-tight mt-1 mb-5">
              NDIAYE ADAMA TECH
            </p>
            <p className="text-2xl mb-8">🇨🇮</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
                <span className="px-3 py-1 border border-gray-700 rounded-full">Agricole</span>
                <span className="px-3 py-1 border border-gray-700 rounded-full">Pharmaceutique</span>
                <span className="px-3 py-1 border border-gray-700 rounded-full">Cosmétique</span>
                <span className="px-3 py-1 border border-gray-700 rounded-full">Pro du Quotidien</span>
                <span className="px-3 py-1 border border-gray-700 rounded-full text-green-400">Sans Bug</span>
            </div>
          </section>
        </main>

        <footer className="py-10 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2024 Omni-Scan AI CI. All Rights Reserved. Engineered by Ndiaye Adama.
        </footer>
      </div>
    </>
  )
}
