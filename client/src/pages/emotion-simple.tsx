import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Smile, Frown, Zap, Cloud, Sun, Moon, Sparkles } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

interface EmotionDevotional {
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
}

const EMOTIONS = [
  { id: "ansioso", label: "😰 Ansioso", icon: Cloud, description: "Preocupado com o futuro" },
  { id: "triste", label: "😢 Triste", icon: Frown, description: "Coração pesado" },
  { id: "alegre", label: "😊 Alegre", icon: Smile, description: "Cheio de gratidão" },
  { id: "cansado", label: "😴 Cansado", icon: Moon, description: "Precisando de descanso" },
  { id: "irritado", label: "😠 Irritado", icon: Zap, description: "Sentindo raiva" },
  { id: "confiante", label: "✨ Confiante", icon: Sun, description: "Firme na fé" },
  { id: "solitario", label: "😔 Solitário", icon: Heart, description: "Precisando de companhia" },
  { id: "grato", label: "🙏 Grato", icon: Sparkles, description: "Reconhecendo bênçãos" }
];

export default function EmotionSimple() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [devotional, setDevotional] = useState<EmotionDevotional | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleEmotionSelect = async (emotionId: string) => {
    console.log("🎯 Emoção selecionada:", emotionId);
    setSelectedEmotion(emotionId);
    setLoading(true);
    setError("");
    setDevotional(null);

    try {
      console.log("📡 Fazendo requisição para:", `/api/emotions/generate-devotional`);
      
      const response = await fetch("/api/emotions/generate-devotional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotion: emotionId, intensity: 5 }),
      });
      
      console.log("📋 Status da resposta:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Dados recebidos:", data);
      setDevotional(data);
    } catch (error: any) {
      console.error("❌ Erro na requisição:", error);
      setError(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Como Você Se Sente Hoje?</h1>
          <p className="text-gray-600">Selecione sua emoção e receba um devocional personalizado</p>
        </div>

        {/* Emotion Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {EMOTIONS.map((emotion) => (
            <Button
              key={emotion.id}
              onClick={() => handleEmotionSelect(emotion.id)}
              disabled={loading}
              className={`h-20 flex flex-col items-center justify-center text-center ${
                selectedEmotion === emotion.id ? 'bg-purple-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              variant={selectedEmotion === emotion.id ? "default" : "outline"}
            >
              <emotion.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{emotion.label}</span>
            </Button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Gerando devocional personalizado...</p>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={() => selectedEmotion && handleEmotionSelect(selectedEmotion)}
                className="mt-4"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Devotional Result */}
        {devotional && !loading && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">{devotional.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{devotional.content}</p>
              
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <p className="text-purple-800 italic mb-2">"{devotional.verse}"</p>
                <p className="text-purple-600 font-semibold text-sm">{devotional.reference}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🙏 Oração</h4>
                <p className="text-blue-700 italic">{devotional.prayer}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!devotional && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Escolha a emoção que melhor descreve como você se sente</li>
                <li>Nossa IA gerará um devocional personalizado</li>
                <li>Receba versículos e orações específicas para seu momento</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}