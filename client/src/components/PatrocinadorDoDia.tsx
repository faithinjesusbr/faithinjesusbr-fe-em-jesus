import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';

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

export default function PatrocinadorDoDia() {
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
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 transition-all duration-500">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Sponsor Image */}
          <div className="flex-shrink-0">
            <img
              src={patrocinador.imagem}
              alt={patrocinador.nome}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white p-1 shadow-md"
              style={{ maxHeight: '5rem' }}
              onError={(e) => {
                console.error(`Erro ao carregar imagem: ${patrocinador.imagem}`);
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patrocinador.nome)}&background=f3f4f6&color=374151&size=80`;
              }}
            />
          </div>

          {/* Sponsor Content */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {patrocinador.nome}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed mt-1">
                  {patrocinador.frase}
                </p>
              </div>

              {/* Instagram Button */}
              <div className="flex-shrink-0">
                <a
                  href={patrocinador.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Instagram className="w-3 h-3" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-3 gap-1">
          {patrocinadores.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-purple-500 w-6' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}