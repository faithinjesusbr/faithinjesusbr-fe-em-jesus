import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CloudRain, Zap, Users, Shield, Smile, Battery } from "lucide-react";
import BottomNav from "@/components/bottom-nav";

const emotions = [
  {
    id: 'triste',
    name: 'Triste',
    icon: CloudRain,
    color: 'from-blue-400 to-blue-600',
    devotional: 'Deus conhece cada lágrima que você derrama. Ele está perto dos quebrantados de coração e consola aqueles que choram. Sua tristeza não é esquecida por Ele.',
    verse: 'Perto está o Senhor dos quebrantados de coração e salva os contritos de espírito.',
    reference: 'Salmos 34:18',
    prayer: 'Pai celestial, venho a Ti com o coração pesado. Consola-me em minha tristeza e lembra-me de que Tu estás sempre comigo. Que Tua paz inunde meu coração. Amém.'
  },
  {
    id: 'agradecido',
    name: 'Agradecido',
    icon: Heart,
    color: 'from-pink-400 to-red-500',
    devotional: 'A gratidão transforma nosso coração e nos aproxima de Deus. Quando reconhecemos Suas bênçãos, nossa fé se fortalece e nossa alegria se multiplica.',
    verse: 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
    reference: '1 Tessalonicenses 5:18',
    prayer: 'Senhor, meu coração transborda de gratidão por todas as Tuas bênçãos. Obrigado por Teu amor incondicional e por cuidar de mim todos os dias. Amém.'
  },
  {
    id: 'ansioso',
    name: 'Ansioso',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    devotional: 'A ansiedade pode nos consumir, mas Deus nos convida a entregar nossas preocupações a Ele. Ele promete cuidar de nós e nos dar a paz que excede todo entendimento.',
    verse: 'Não andeis ansiosos por coisa alguma; antes, em tudo, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.',
    reference: 'Filipenses 4:6',
    prayer: 'Pai, entrego a Ti todas as minhas ansiedades e preocupações. Ajuda-me a confiar em Ti e a descansar em Tua paz. Sei que Tu tens o controle de tudo. Amém.'
  },
  {
    id: 'sozinho',
    name: 'Sozinho',
    icon: Users,
    color: 'from-gray-400 to-gray-600',
    devotional: 'Mesmo quando nos sentimos sozinhos, Deus nunca nos abandona. Ele promete estar conosco sempre, até o fim dos tempos. Você é amado e nunca está verdadeiramente só.',
    verse: 'Não te deixarei nem te desampararei.',
    reference: 'Hebreus 13:5',
    prayer: 'Senhor Jesus, quando me sinto sozinho, lembra-me de que Tu estás sempre comigo. Ajuda-me a sentir Tua presença e a encontrar comunhão contigo e com outros. Amém.'
  },
  {
    id: 'com-medo',
    name: 'Com Medo',
    icon: Shield,
    color: 'from-purple-400 to-indigo-600',
    devotional: 'O medo é natural, mas não precisa nos dominar. Deus é nosso refúgio e fortaleza, nosso socorro bem presente nas tribulações. Nele encontramos coragem e proteção.',
    verse: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.',
    reference: 'Isaías 41:10',
    prayer: 'Deus Todo-Poderoso, quando o medo me invade, lembra-me de que Tu és maior que qualquer coisa que eu possa enfrentar. Dá-me coragem e força. Amém.'
  },
  {
    id: 'feliz',
    name: 'Feliz',
    icon: Smile,
    color: 'from-green-400 to-emerald-500',
    devotional: 'A alegria é um presente de Deus. Quando nosso coração está feliz, é uma oportunidade de louvar ao Senhor e compartilhar essa alegria com outros, sendo luz no mundo.',
    verse: 'Este é o dia que fez o Senhor; regozijemo-nos, e alegremo-nos nele.',
    reference: 'Salmos 118:24',
    prayer: 'Senhor, obrigado por esta alegria que enche meu coração. Que eu possa compartilhar esta felicidade com outros e sempre Te louvar em todas as circunstâncias. Amém.'
  },
  {
    id: 'cansado',
    name: 'Cansado',
    icon: Battery,
    color: 'from-orange-400 to-red-600',
    devotional: 'Jesus nos convida a vir a Ele quando estamos cansados e sobrecarregados. Ele promete nos dar descanso e renovar nossas forças como as águias que voam alto.',
    verse: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
    reference: 'Mateus 11:28',
    prayer: 'Jesus, venho a Ti cansado e em busca de descanso. Renova minhas forças e me ajuda a encontrar descanso em Ti. Que eu possa confiar em Teu cuidado. Amém.'
  }
];

export default function MoodToday() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const selectedEmotionData = emotions.find(e => e.id === selectedEmotion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-cyan-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Como Você Está Hoje?</h1>
            <p className="text-gray-600">Escolha como está se sentindo e receba uma palavra de Deus</p>
          </div>

          {!selectedEmotion ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {emotions.map((emotion) => {
                const IconComponent = emotion.icon;
                return (
                  <Button
                    key={emotion.id}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    className={`h-24 p-4 bg-gradient-to-r ${emotion.color} hover:scale-105 transition-all duration-200 text-white border-0 shadow-lg rounded-xl flex flex-col gap-2`}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="text-sm font-medium">{emotion.name}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {(() => {
                      const IconComponent = selectedEmotionData.icon;
                      return <IconComponent className="h-8 w-8 text-gray-600" />;
                    })()}
                    <CardTitle className="text-2xl text-gray-900">
                      Você está se sentindo {selectedEmotionData.name.toLowerCase()}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Texto Devocional */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Palavra de Encorajamento</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedEmotionData.devotional}
                    </p>
                  </div>

                  {/* Versículo */}
                  <div className={`bg-gradient-to-r ${selectedEmotionData.color} bg-opacity-10 rounded-lg p-6`}>
                    <h3 className="font-semibold text-gray-900 mb-3">Versículo Bíblico</h3>
                    <blockquote className="text-gray-800 italic text-lg leading-relaxed mb-2">
                      "{selectedEmotionData.verse}"
                    </blockquote>
                    <cite className="text-gray-700 font-medium">{selectedEmotionData.reference}</cite>
                  </div>

                  {/* Oração */}
                  <div className="bg-amber-50 rounded-lg p-6">
                    <h3 className="font-semibold text-amber-900 mb-3">Oração</h3>
                    <p className="text-amber-800 leading-relaxed italic">
                      {selectedEmotionData.prayer}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => setSelectedEmotion(null)}
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      Escolher Outro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}