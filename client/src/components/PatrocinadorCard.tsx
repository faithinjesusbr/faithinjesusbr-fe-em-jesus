import { useState } from 'react';
import { Instagram, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Patrocinador {
  nome: string;
  imagem: string;
  instagram_url: string;
  frase: string;
}

interface PatrocinadorCardProps {
  patrocinador: Patrocinador;
  variant?: 'home' | 'compact' | 'featured';
  className?: string;
}

export default function PatrocinadorCard({ 
  patrocinador, 
  variant = 'home',
  className = ''
}: PatrocinadorCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    console.error(`Erro ao carregar imagem: ${patrocinador.imagem}`);
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patrocinador.nome)}&background=8b5cf6&color=ffffff&size=200&bold=true`;
  };

  // Variante compacta para a tela inicial
  if (variant === 'compact') {
    return (
      <div className={`w-full mb-6 ${className}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Imagem do Patrocinador */}
            <div className="flex-shrink-0 relative">
              <div className="relative">
                {!imageLoaded && !imageError && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-pulse" />
                )}
                <img
                  src={patrocinador.imagem}
                  alt={patrocinador.nome}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover bg-white p-1 shadow-md transition-all duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Conteúdo do Patrocinador */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {patrocinador.nome}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed mt-1 line-clamp-2">
                    {patrocinador.frase}
                  </p>
                </div>

                {/* Botão Instagram */}
                <div className="flex-shrink-0">
                  <a
                    href={patrocinador.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Instagram className="w-3 h-3" />
                    <span className="hidden sm:inline">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variante em destaque para a tela inicial
  if (variant === 'featured') {
    return (
      <div className={`w-full mb-6 ${className}`}>
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 transition-all duration-700 hover:shadow-xl">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Patrocinador em Destaque
            </h3>
            <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Imagem do Patrocinador com Efeito de Brilho */}
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative">
                {!imageLoaded && !imageError && (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-pulse" />
                )}
                <img
                  src={patrocinador.imagem}
                  alt={patrocinador.nome}
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-full object-cover bg-white p-2 shadow-lg transition-all duration-300 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Conteúdo do Patrocinador */}
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

            {/* Botão Instagram */}
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
        </div>
      </div>
    );
  }

  // Variante padrão para a página de patrocinadores
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="text-center">
          {/* Imagem do Patrocinador */}
          <div className="relative inline-block mb-4">
            {!imageLoaded && !imageError && (
              <div className="w-32 h-32 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200 animate-pulse" />
            )}
            <img
              src={patrocinador.imagem}
              alt={patrocinador.nome}
              className={`w-32 h-32 rounded-lg object-cover shadow-md transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Parceiro
            </div>
          </div>

          {/* Nome do Patrocinador */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {patrocinador.nome}
          </h3>

          {/* Frase do Patrocinador */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm italic text-gray-600 leading-relaxed">
              "{patrocinador.frase}"
            </p>
          </div>

          {/* Botão Instagram */}
          <Button 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => window.open(patrocinador.instagram_url, '_blank')}
          >
            <Instagram className="w-4 h-4 mr-2" />
            Seguir no Instagram
            <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
          </Button>
        </div>
      </div>
    </div>
  );
}