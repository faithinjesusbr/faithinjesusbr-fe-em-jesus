import { useState, useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

interface Patrocinador {
  nome: string;
  imagem: string;
  instagram_url: string;
  frase: string;
}

const patrocinadores: Patrocinador[] = [
  {
    nome: "Emicleiton Emys",
    imagem: "/patrocinador1.png",
    instagram_url: "https://www.instagram.com/emicleitonemys?igsh=NjllM3NsbmJyazk3",
    frase: "Provérbios 11:25 — A alma generosa prosperará; quem dá alívio aos outros, alívio receberá."
  },
  {
    nome: "Super Hiper Real", 
    imagem: "/patrocinador2.png",
    instagram_url: "https://www.instagram.com/superhiperreal?igsh=MTViMzgxYWZsbjZ1eg==",
    frase: "Lucas 6:38 — Dai, e dar-se-vos-á: boa medida, recalcada, sacudida e transbordante."
  }
];

export default function PatrocinadoresHomeBonito() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % patrocinadores.length);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const patrocinador = patrocinadores[currentIndex];

  return (
    <div className="w-full mb-6">
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 transition-all duration-700 hover:shadow-xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            ✨ Patrocinador em Destaque
          </h3>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Sponsor Image with Glow Effect */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative">
              <img
                src={patrocinador.imagem}
                alt={patrocinador.nome}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover bg-white p-2 shadow-lg transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${patrocinador.nome}&background=f3f4f6&color=374151&size=112`;
                }}
              />
            </div>
          </div>

          {/* Sponsor Content */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <h4 className="text-xl font-bold text-gray-800">
              {patrocinador.nome}
            </h4>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40">
              <p className="text-sm italic text-gray-700 leading-relaxed">
                "{patrocinador.frase}"
              </p>
            </div>
          </div>

          {/* Instagram Button */}
          <div className="flex-shrink-0">
            <a
              href={patrocinador.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Seguir</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>
        </div>

        {/* Progress Indicator with Animation */}
        <div className="flex justify-center mt-6 gap-2">
          {patrocinadores.map((_, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8 h-2' 
                  : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Apoiando nosso ministério digital • Muda a cada 1 minuto
          </p>
        </div>
      </div>
    </div>
  );
}