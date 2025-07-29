import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Heart, Brain, Smile, Frown, Angry, Meh, 
  BookOpen, Sparkles, Clock, TrendingUp 
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EmotionalState {
  id: string;
  emotion: string;
  intensity: number;
  description: string;
  aiResponse?: string;
  suggestedVerse?: string;
  verseReference?: string;
  personalizedPrayer?: string;
  createdAt: string;
}

const emotions = [
  { value: "happy", label: "Feliz", icon: Smile, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { value: "sad", label: "Triste", icon: Frown, color: "text-blue-500", bgColor: "bg-blue-50" },
  { value: "anxious", label: "Ansioso", icon: Brain, color: "text-purple-500", bgColor: "bg-purple-50" },
  { value: "angry", label: "Raiva", icon: Angry, color: "text-red-500", bgColor: "bg-red-50" },
  { value: "peaceful", label: "Paz", icon: Heart, color: "text-green-500", bgColor: "bg-green-50" },
  { value: "confused", label: "Confuso", icon: Meh, color: "text-gray-500", bgColor: "bg-gray-50" },
];

export default function EmotionTodayPage() {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [description, setDescription] = useState("");
  const [aiResponse, setAiResponse] = useState<EmotionalState | null>(null);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: emotionalHistory } = useQuery({
    queryKey: ["/api/emotional-states", user.id],
    enabled: !!user.id,
  });

  const submitEmotionMutation = useMutation({
    mutationFn: async (data: {
      emotion: string;
      intensity: number;
      description: string;
    }) => {
      return apiRequest("/api/emotions/guidance", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      setAiResponse(data);
      queryClient.invalidateQueries({ queryKey: ["/api/emotions/guidance"] });
      toast({
        title: "Orientação Recebida",
        description: "A IA analisou seu estado emocional e gerou uma resposta personalizada.",
      });
    },
    onError: () => {
      // Mesmo com erro, dar uma resposta de fallback
      setAiResponse({
        emotion: selectedEmotion,
        response: "Deus conhece seu coração e suas emoções. Ele está sempre presente para te confortar e dar força. Lembre-se de que você não está sozinho nesta jornada.",
        verse: "Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.",
        reference: "2 Timóteo 1:7"
      });
      toast({
        title: "Orientação Disponível",
        description: "Aqui está uma palavra de encorajamento para você.",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedEmotion || !description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione uma emoção e descreva como se sente.",
        variant: "destructive",
      });
      return;
    }

    submitEmotionMutation.mutate({
      emotion: selectedEmotion,
      intensity: intensity[0],
      description,
    });
  };

  const resetForm = () => {
    setSelectedEmotion("");
    setIntensity([5]);
    setDescription("");
    setAiResponse(null);
  };

  const getEmotionColor = (emotion: string) => {
    const emotionData = emotions.find(e => e.value === emotion);
    return emotionData?.color || "text-gray-500";
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionData = emotions.find(e => e.value === emotion);
    const Icon = emotionData?.icon || Heart;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Sinto Hoje
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Compartilhe como você está se sentindo e receba orientação espiritual personalizada
        </p>
      </div>

      {!aiResponse ? (
        /* Form */
        <div className="space-y-8">
          {/* Emotion Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Como você está se sentindo hoje?
              </CardTitle>
              <CardDescription>
                Selecione a emoção que melhor descreve seu estado atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emotions.map((emotion) => {
                  const Icon = emotion.icon;
                  return (
                    <Button
                      key={emotion.value}
                      variant={selectedEmotion === emotion.value ? "default" : "outline"}
                      className={`h-20 flex flex-col gap-2 ${
                        selectedEmotion === emotion.value 
                          ? `${emotion.bgColor} border-2` 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedEmotion(emotion.value)}
                    >
                      <Icon className={`h-6 w-6 ${emotion.color}`} />
                      <span className="text-sm">{emotion.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Intensity */}
          {selectedEmotion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Intensidade: {intensity[0]}/10
                </CardTitle>
                <CardDescription>
                  O quão intenso é esse sentimento?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Leve</span>
                    <span>Moderado</span>
                    <span>Intenso</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {selectedEmotion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Conte-nos mais
                </CardTitle>
                <CardDescription>
                  Descreva o que está acontecendo ou causando esse sentimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ex: Estou preocupado com uma decisão importante no trabalho..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          {selectedEmotion && description && (
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={submitEmotionMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3"
              >
                {submitEmotionMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Receber Orientação
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* AI Response */
        <div className="space-y-6">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Sparkles className="h-5 w-5" />
                Sua Orientação Espiritual Personalizada
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {getEmotionIcon(aiResponse.emotion)}
                  <span className="ml-1">{emotions.find(e => e.value === aiResponse.emotion)?.label}</span>
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Intensidade: {aiResponse.intensity}/10
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-800">Orientação:</h4>
                <p className="text-gray-700 leading-relaxed">{aiResponse.aiResponse}</p>
              </div>

              {aiResponse.suggestedVerse && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Versículo para Reflexão:
                  </h4>
                  <blockquote className="text-blue-700 italic mb-2">
                    "{aiResponse.suggestedVerse}"
                  </blockquote>
                  <p className="text-sm text-blue-600 font-medium">{aiResponse.verseReference}</p>
                </div>
              )}

              {aiResponse.personalizedPrayer && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Oração Personalizada:
                  </h4>
                  <p className="text-green-700 leading-relaxed italic">
                    {aiResponse.personalizedPrayer}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={resetForm} variant="outline" className="flex-1">
                  Nova Consulta
                </Button>
                <Button 
                  onClick={() => {
                    const text = `Orientação Espiritual - ${new Date().toLocaleDateString()}\n\n${aiResponse.aiResponse}\n\n"${aiResponse.suggestedVerse}"\n- ${aiResponse.verseReference}\n\nOração: ${aiResponse.personalizedPrayer}`;
                    navigator.clipboard.writeText(text);
                    toast({ title: "Copiado!", description: "Orientação copiada para área de transferência." });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Copiar Orientação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History */}
      {emotionalHistory && emotionalHistory.length > 0 && !aiResponse && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Emoções
            </CardTitle>
            <CardDescription>
              Suas últimas consultas emocionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emotionalHistory.slice(0, 5).map((state: EmotionalState) => (
                <div key={state.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${emotions.find(e => e.value === state.emotion)?.bgColor || 'bg-gray-50'}`}>
                      {getEmotionIcon(state.emotion)}
                    </div>
                    <div>
                      <p className="font-medium">{emotions.find(e => e.value === state.emotion)?.label}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{state.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{state.intensity}/10</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(state.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-none">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            Como funciona o "Sinto Hoje"
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Compartilhe seus sentimentos de forma segura e anônima</li>
            <li>• Receba orientação baseada na Palavra de Deus</li>
            <li>• Obtenha versículos e orações personalizadas</li>
            <li>• Ganhe pontos por cuidar da saúde emocional</li>
            <li>• Mantenha um histórico para acompanhar seu progresso</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}