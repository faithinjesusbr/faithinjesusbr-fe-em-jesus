import { useState, useEffect } from 'react';
import PatrocinadorCard from './PatrocinadorCard';

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

interface PatrocinadoresExibicaoProps {
  variant?: 'home' | 'sponsors' | 'compact' | 'featured';
  autoRotate?: boolean;
  rotateInterval?: number;
  showIndicators?: boolean;
  className?: string;
}

export default function PatrocinadoresExibicao({ 
  variant = 'home',
  autoRotate = true,
  rotateInterval = 60000, // 60 segundos
  showIndicators = true,
  className = ''
}: PatrocinadoresExibicaoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || patrocinadores.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % patrocinadores.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval]);

  const currentPatrocinador = patrocinadores[currentIndex];

  // Para a página de patrocinadores, mostra todos em grid
  if (variant === 'sponsors') {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Patrocinadores em Destaque
          </h2>
          <p className="text-gray-600 mb-6">
            Conheça nossos parceiros que apoiam esta missão
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patrocinadores.map((patrocinador, index) => (
            <PatrocinadorCard 
              key={index} 
              patrocinador={patrocinador} 
              variant="home"
            />
          ))}
        </div>
      </div>
    );
  }

  // Para outras variantes, mostra um patrocinador rotativo
  return (
    <div className={`w-full ${className}`}>
      <PatrocinadorCard 
        patrocinador={currentPatrocinador} 
        variant={variant === 'compact' ? 'compact' : variant === 'featured' ? 'featured' : 'home'}
      />
      
      {/* Indicadores de progresso */}
      {showIndicators && patrocinadores.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {patrocinadores.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-purple-500 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir para patrocinador ${index + 1}`}
            />
          ))}
        </div>
      )}

      {patrocinadores.length > 1 && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Patrocinador {currentIndex + 1} de {patrocinadores.length}
        </p>
      )}
    </div>
  );
}

export { patrocinadores };