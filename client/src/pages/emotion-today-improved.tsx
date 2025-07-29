import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, 
  Smile, 
  Frown, 
  Zap, 
  Cloud, 
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Share2,
  Download,
  MessageCircle,
  HandHeart as PrayingHands,
  Gift
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmotionDevotional {
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}

const EMOTIONS = [
  { id: "ansioso", label: "😰 Ansioso", icon: Cloud, color: "bg-gray-100 text-gray-800 border-gray-300", description: "Preocupado com o futuro" },
  { id: "triste", label: "😢 Triste", icon: Frown, color: "bg-blue-100 text-blue-800 border-blue-300", description: "Coração pesado" },
  { id: "alegre", label: "😊 Alegre", icon: Smile, color: "bg-yellow-100 text-yellow-800 border-yellow-300", description: "Cheio de gratidão" },
  { id: "cansado", label: "😴 Cansado", icon: Moon, color: "bg-indigo-100 text-indigo-800 border-indigo-300", description: "Precisando de descanso" },
  { id: "irritado", label: "😠 Irritado", icon: Zap, color: "bg-red-100 text-red-800 border-red-300", description: "Sentindo raiva" },
  { id: "confiante", label: "✨ Confiante", icon: Sun, color: "bg-orange-100 text-orange-800 border-orange-300", description: "Firme na fé" },
  { id: "solitario", label: "😔 Solitário", icon: Heart, color: "bg-purple-100 text-purple-800 border-purple-300", description: "Precisando de companhia" },
  { id: "grato", label: "🙏 Grato", icon: Sparkles, color: "bg-green-100 text-green-800 border-green-300", description: "Reconhecendo bênçãos" },
];

export default function EmotionTodayImproved() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [showDevotional, setShowDevotional] = useState(false);
  const [devotional, setDevotional] = useState<EmotionDevotional | null>(null);
  const { toast } = useToast();

  const generateDevotionalMutation = useMutation({
    mutationFn: async (emotion: string) => {
      const response = await apiRequest("/api/emotions/generate-devotional", {
        method: "POST",
        body: { emotion, intensity: 5 },
      });
      return response;
    },
    onSuccess: (data: any) => {
      setDevotional(data);
      setShowDevotional(true);
      toast({
        title: "Devocional Personalizado Gerado!",
        description: "IA Cristo criou um devocional especial para você.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o devocional. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    generateDevotionalMutation.mutate(emotionId);
  };

  const shareDevotional = () => {
    if (devotional && navigator.share) {
      navigator.share({
        title: `${devotional.title} - Fé em Jesus BR`,
        text: `"${devotional.verse}" - ${devotional.reference}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${devotional?.title}\n\n"${devotional?.verse}" - ${devotional?.reference}`);
      toast({
        title: "Copiado!",
        description: "Devocional copiado para compartilhar.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Como Você Se Sente Hoje?
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compartilhe sua emoção atual e receba um devocional personalizado gerado por IA, 
            com versículos e orações específicas para seu momento espiritual.
          </p>
        </div>

        {/* Emotion Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {EMOTIONS.map((emotion) => (
            <Card
              key={emotion.id}
              className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${
                selectedEmotion === emotion.id 
                  ? emotion.color 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleEmotionSelect(emotion.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="mb-3">
                  <emotion.icon className="h-8 w-8 mx-auto text-gray-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{emotion.label}</h3>
                <p className="text-xs text-gray-500">{emotion.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {generateDevotionalMutation.isPending && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                IA Cristo está preparando seu devocional...
              </h3>
              <p className="text-gray-600">
                Buscando versículos e orações personalizadas para sua emoção atual
              </p>
            </CardContent>
          </Card>
        )}

        {/* How it Works */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              ✨ Como Funciona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">1. Escolha sua Emoção</h4>
                <p className="text-sm text-gray-600">Selecione como está se sentindo agora</p>
              </div>
              <div className="text-center">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">2. IA Personaliza</h4>
                <p className="text-sm text-gray-600">Nossa IA gera conteúdo bíblico específico</p>
              </div>
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">3. Receba Conforto</h4>
                <p className="text-sm text-gray-600">Devocional, versículo e oração exclusivos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Devotional Preview */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              Exemplo de Devocional Personalizado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-bold text-gray-800 mb-2">🌟 Paz em Meio à Ansiedade</h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Quando a ansiedade bate à porta do seu coração, lembre-se de que você serve a um Deus 
                que tem o controle de todas as coisas. Ele conhece cada preocupação que habita em você 
                e quer transformar sua inquietação em paz que excede todo entendimento...
              </p>
              <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <p className="text-purple-800 italic text-sm">
                  "Não andeis cuidadosos coisa alguma; antes, as vossas petições sejam em tudo conhecidas 
                  diante de Deus, pela oração e súplicas, com ação de graças."
                </p>
                <p className="text-purple-600 text-xs font-semibold mt-1">Filipenses 4:6</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">
              💡 Cada devocional é único e criado especialmente para sua emoção atual
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />

      {/* Devotional Modal */}
      <Dialog open={showDevotional} onOpenChange={setShowDevotional}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {devotional?.title}
            </DialogTitle>
          </DialogHeader>
          
          {devotional && (
            <div className="space-y-6">
              {/* Emotion Badge */}
              <div className="text-center">
                <Badge className="px-4 py-2 text-sm bg-purple-100 text-purple-800">
                  Devocional para: {EMOTIONS.find(e => e.id === selectedEmotion)?.label}
                </Badge>
              </div>

              {/* Devotional Content */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <div className="prose prose-sm max-w-none">
                  {devotional.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bible Verse */}
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Versículo</span>
                </div>
                <blockquote className="text-lg italic text-gray-800 mb-2">
                  "{devotional.verse}"
                </blockquote>
                <p className="text-sm font-semibold text-purple-600">
                  {devotional.reference}
                </p>
              </div>

              {/* Prayer */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <PrayingHands className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Oração Personalizada</span>
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  {devotional.prayer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={shareDevotional}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.print()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>

              {/* AI Attribution */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  ✨ Devocional personalizado gerado por IA Cristo especialmente para você
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}