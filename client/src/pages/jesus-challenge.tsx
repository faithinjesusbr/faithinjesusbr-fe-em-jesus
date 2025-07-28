import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Calendar, CheckCircle, Lock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";

const challenges = [
  {
    id: '7-days',
    title: 'Desafio 7 Dias com Jesus',
    description: 'Uma semana de crescimento espiritual intenso',
    duration: 7,
    color: 'from-green-500 to-emerald-600',
    days: [
      {
        day: 1,
        title: 'Começando a Jornada',
        content: 'Bem-vindo ao seu desafio de 7 dias com Jesus! Hoje é o primeiro passo de uma jornada transformadora. Deus tem planos maravilhosos para sua vida.',
        verse: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
        reference: 'Jeremias 29:11',
        reflection: 'Reflita sobre os planos que Deus tem para você. Como você pode se abrir mais para Sua vontade em sua vida?'
      },
      {
        day: 2,
        title: 'Confiança em Deus',
        content: 'Hoje aprendemos sobre confiar em Deus mesmo quando não entendemos o caminho. A fé nos leva além do que nossos olhos podem ver.',
        verse: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.',
        reference: 'Provérbios 3:5',
        reflection: 'Em que áreas da sua vida você precisa confiar mais em Deus e menos no seu próprio entendimento?'
      },
      {
        day: 3,
        title: 'Amor Incondicional',
        content: 'O amor de Deus por nós não depende de nossas obras ou méritos. É um amor incondicional que nos transforma de dentro para fora.',
        verse: 'Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.',
        reference: 'Romanos 5:8',
        reflection: 'Como você pode demonstrar esse amor incondicional de Deus para outras pessoas hoje?'
      },
      {
        day: 4,
        title: 'Força na Fraqueza',
        content: 'Deus usa nossas fraquezas para mostrar Sua força. Quando reconhecemos nossa dependência Dele, experimentamos Seu poder em nossas vidas.',
        verse: 'E disse-me: A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.',
        reference: '2 Coríntios 12:9',
        reflection: 'Quais são suas fraquezas? Como Deus pode usar essas áreas para mostrar Sua força?'
      },
      {
        day: 5,
        title: 'Perdão e Libertação',
        content: 'O perdão nos liberta do peso do passado. Deus nos perdoa completamente e nos chama a perdoar outros como fomos perdoados.',
        verse: 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça.',
        reference: '1 João 1:9',
        reflection: 'Há alguém que você precisa perdoar? Há algo que você precisa confessar a Deus?'
      },
      {
        day: 6,
        title: 'Propósito e Chamado',
        content: 'Cada um de nós tem um propósito único no Reino de Deus. Ele nos criou com dons específicos para abençoar outros e glorificar Seu nome.',
        verse: 'Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus preparou para que andássemos nelas.',
        reference: 'Efésios 2:10',
        reflection: 'Quais são os dons que Deus te deu? Como você pode usá-los para servir outros?'
      },
      {
        day: 7,
        title: 'Nova Criatura',
        content: 'Parabéns! Você completou 7 dias com Jesus. Você é uma nova criatura em Cristo. O que passou já passou, agora você vive uma nova vida em Deus.',
        verse: 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.',
        reference: '2 Coríntios 5:17',
        reflection: 'Como você se sente diferente após esta semana com Jesus? Que mudanças você percebe em sua vida?'
      }
    ]
  },
  {
    id: '21-days',
    title: 'Desafio 21 Dias com Jesus',
    description: 'Três semanas de transformação espiritual profunda',
    duration: 21,
    color: 'from-purple-500 to-indigo-600',
    days: [
      // Semana 1 - Fundamentos da Fé
      {
        day: 1,
        title: 'Iniciando a Jornada de 21 Dias',
        content: 'Bem-vindo a uma jornada transformadora de 21 dias com Jesus! Prepare seu coração para experimentar o amor, a graça e o poder de Deus de uma forma nova.',
        verse: 'Portanto, se alguém está em Cristo, é nova criação. As coisas antigas já passaram; eis que surgiram coisas novas!',
        reference: '2 Coríntios 5:17',
        reflection: 'Que expectativas você tem para estes 21 dias? Como você quer que Deus transforme sua vida?'
      },
      // ... (adicionar os outros 20 dias)
      {
        day: 21,
        title: 'Celebrando a Transformação',
        content: 'Parabéns! Você completou 21 dias com Jesus. Esta é apenas o começo de uma vida transformada. Continue caminhando com Ele todos os dias.',
        verse: 'Ora, àquele que é poderoso para fazer tudo muito mais abundantemente além daquilo que pedimos ou pensamos, segundo o poder que em nós opera.',
        reference: 'Efésios 3:20',
        reflection: 'Como Deus transformou sua vida nestes 21 dias? Que compromissos você fará para continuar crescendo espiritualmente?'
      }
    ]
  }
];

export default function JesusChallenge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);

  const { data: userProgress } = useQuery({
    queryKey: ['/api/challenge-progress', user?.id, selectedChallenge?.id],
    enabled: !!user?.id && !!selectedChallenge?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (dayNumber) => {
      await apiRequest("/api/challenge-progress", "POST", {
        userId: user?.id,
        challengeId: selectedChallenge.id,
        dayNumber,
        completed: true
      });
    },
    onSuccess: (_, dayNumber) => {
      queryClient.invalidateQueries({ queryKey: ['/api/challenge-progress'] });
      toast({
        title: "Dia concluído!",
        description: `Dia ${dayNumber} marcado como lido. Continue sua jornada!`,
      });
      
      // Se completou o desafio, mostrar certificado
      if (dayNumber === selectedChallenge.duration) {
        setTimeout(() => {
          toast({
            title: "🎉 Parabéns!",
            description: `Você completou o ${selectedChallenge.title}! Certificado desbloqueado!`,
          });
        }, 1000);
      }
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível marcar como lido.",
        variant: "destructive",
      });
    },
  });

  const getCompletedDays = () => {
    if (!userProgress) return [];
    return userProgress.filter(p => p.completed).map(p => p.dayNumber);
  };

  const getNextAvailableDay = () => {
    const completed = getCompletedDays();
    if (completed.length === 0) return 1;
    return Math.max(...completed) + 1;
  };

  const isDayUnlocked = (dayNumber) => {
    const completed = getCompletedDays();
    return dayNumber === 1 || completed.includes(dayNumber - 1);
  };

  const isDayCompleted = (dayNumber) => {
    return getCompletedDays().includes(dayNumber);
  };

  const getProgress = () => {
    if (!selectedChallenge) return 0;
    const completed = getCompletedDays().length;
    return (completed / selectedChallenge.duration) * 100;
  };

  const currentDayData = selectedChallenge?.days?.find(d => d.day === currentDay);

  if (!selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-8 w-8 text-amber-600" />
                <h1 className="text-3xl font-bold text-gray-900">Desafio com Jesus</h1>
              </div>
              <p className="text-gray-600">Escolha seu desafio espiritual e transforme sua vida</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="shadow-xl border-0 bg-white/90 backdrop-blur hover:scale-105 transition-all duration-200 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${challenge.color} flex items-center justify-center mx-auto mb-4`}>
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{challenge.title}</CardTitle>
                    <p className="text-gray-600">{challenge.description}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-4">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {challenge.duration} Dias
                      </Badge>
                      <Button
                        onClick={() => setSelectedChallenge(challenge)}
                        className={`w-full bg-gradient-to-r ${challenge.color} hover:opacity-90 text-white border-0 shadow-lg rounded-full py-3`}
                      >
                        Escolher Desafio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              onClick={() => setSelectedChallenge(null)}
              variant="outline"
              className="mb-4"
            >
              ← Voltar aos Desafios
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedChallenge.title}</h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Progress value={getProgress()} className="w-64" />
              <span className="text-sm font-medium text-gray-600">
                {getCompletedDays().length}/{selectedChallenge.duration} dias
              </span>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 mb-8">
            {Array.from({ length: selectedChallenge.duration }, (_, i) => {
              const dayNumber = i + 1;
              const isCompleted = isDayCompleted(dayNumber);
              const isUnlocked = isDayUnlocked(dayNumber);
              const isCurrent = dayNumber === currentDay;

              return (
                <Button
                  key={dayNumber}
                  onClick={() => isUnlocked && setCurrentDay(dayNumber)}
                  disabled={!isUnlocked}
                  variant={isCurrent ? "default" : "outline"}
                  className={`h-12 w-12 p-0 relative ${
                    isCompleted 
                      ? 'bg-green-500 text-white border-green-500' 
                      : isUnlocked 
                        ? (isCurrent ? `bg-gradient-to-r ${selectedChallenge.color} text-white` : '')
                        : 'opacity-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isUnlocked ? (
                    dayNumber
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Current Day Content */}
          {currentDayData && (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className={`bg-gradient-to-r ${selectedChallenge.color} text-white`}>
                    Dia {currentDayData.day}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-gray-900">{currentDayData.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Reflexão do Dia</h3>
                  <p className="text-gray-700 leading-relaxed">{currentDayData.content}</p>
                </div>

                <div className={`bg-gradient-to-r ${selectedChallenge.color} bg-opacity-10 rounded-lg p-6`}>
                  <h3 className="font-semibold text-gray-900 mb-3">Versículo</h3>
                  <blockquote className="text-gray-800 italic text-lg leading-relaxed mb-2">
                    "{currentDayData.verse}"
                  </blockquote>
                  <cite className="text-gray-700 font-medium">{currentDayData.reference}</cite>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Para Refletir</h3>
                  <p className="text-blue-800 leading-relaxed">{currentDayData.reflection}</p>
                </div>

                {!isDayCompleted(currentDay) && isDayUnlocked(currentDay) && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => markAsReadMutation.mutate(currentDay)}
                      disabled={markAsReadMutation.isPending}
                      className={`bg-gradient-to-r ${selectedChallenge.color} hover:opacity-90 text-white px-8 py-3 rounded-full shadow-lg`}
                    >
                      {markAsReadMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Marcando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Lido
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isDayCompleted(currentDay) && (
                  <div className="text-center py-4">
                    <Badge className="bg-green-500 text-white text-lg px-6 py-2">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Dia Concluído!
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Certificate */}
          {getCompletedDays().length === selectedChallenge.duration && (
            <Card className="shadow-xl border-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white mt-8">
              <CardContent className="p-8 text-center">
                <Star className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">🎉 Parabéns!</h2>
                <p className="text-lg mb-4">
                  Você completou o {selectedChallenge.title}!
                </p>
                <p className="mb-6">
                  Seu certificado de conclusão está disponível. Continue sua jornada espiritual!
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Ver Certificado
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}