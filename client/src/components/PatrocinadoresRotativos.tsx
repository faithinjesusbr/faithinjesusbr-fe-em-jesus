import { useState, useEffect } from 'react';

interface Patrocinador {
  id: number;
  imagem: string;
  link: string;
  nome: string;
}

const patrocinadores: Patrocinador[] = [
  {
    id: 1,
    imagem: '/patrocinador1.png',
    link: 'https://www.instagram.com/emicleitonemys',
    nome: 'Emicleiton Emys'
  },
  {
    id: 2,
    imagem: '/patrocinador2.png',
    link: 'https://www.instagram.com/superhiperreal',
    nome: 'Super Hiper Real'
  }
];

export default function PatrocinadoresRotativos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % patrocinadores.length);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const currentPatrocinador = patrocinadores[currentIndex];

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Nossos Patrocinadores
        </h3>
        
        <div className="flex justify-center">
          <a
            href={currentPatrocinador.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={currentPatrocinador.imagem}
              alt={currentPatrocinador.nome}
              className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 object-contain"
              style={{ maxHeight: '300px' }}
              onError={(e) => {
                console.error(`Erro ao carregar imagem: ${currentPatrocinador.imagem}`);
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentPatrocinador.nome)}&background=f3f4f6&color=374151&size=300`;
              }}
            />
          </a>
        </div>

        <p className="text-center text-sm text-gray-600 mt-3">
          {currentPatrocinador.nome}
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center mt-4 gap-2">
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

        <p className="text-xs text-gray-500 text-center mt-2">
          Clique na imagem para visitar o Instagram
        </p>
      </div>
    </div>
  );
}