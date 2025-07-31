import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  showNavigationButtons?: boolean;
  className?: string;
}

export default function PatrocinadoresExibicao({ 
  variant = 'home',
  autoRotate = true,
  rotateInterval = 5000, // 5 segundos
  showIndicators = true,
  showNavigationButtons = true,
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

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? patrocinadores.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % patrocinadores.length);
  };

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
      <div className="relative">
        {/* Botões de navegação */}
        {showNavigationButtons && patrocinadores.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-purple-200 hover:border-purple-300"
            >
              <ChevronLeft className="h-4 w-4 text-purple-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-purple-200 hover:border-purple-300"
            >
              <ChevronRight className="h-4 w-4 text-purple-600" />
            </Button>
          </>
        )}

        <PatrocinadorCard 
          patrocinador={currentPatrocinador} 
          variant={variant === 'compact' ? 'compact' : variant === 'featured' ? 'featured' : 'home'}
        />
      </div>
      
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
        <div className="flex justify-center items-center gap-3 mt-2">
          <p className="text-xs text-gray-500 text-center">
            Patrocinador {currentIndex + 1} de {patrocinadores.length}
          </p>
          {showNavigationButtons && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                Anterior
              </Button>
              <span className="text-gray-300">|</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                Próximo
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { patrocinadores };