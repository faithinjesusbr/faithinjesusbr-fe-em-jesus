import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Heart, BookOpen, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Emotion {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface EmotionDevotional {
  id: string;
  emotionId: string;
  title: string;
  content: string;
  verse: string;
  reference: string;
  prayer: string;
  createdAt: string;
}

export default function EmotionsPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [devotional, setDevotional] = useState<EmotionDevotional | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: emotions, isLoading: emotionsLoading } = useQuery({
    queryKey: ["/api/emotions"],
  });

  const generateDevotionalMutation = useMutation({
    mutationFn: async (emotionId: string) => {
      return apiRequest(`/api/emotions/${emotionId}/devotional`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      setDevotional(data);
      toast({
        title: "Devocional gerado!",
        description: "Seu devocional personalizado está pronto.",
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

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setDevotional(null);
    generateDevotionalMutation.mutate(emotion.id);
  };

  if (emotionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (devotional && selectedEmotion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDevotional(null);
                setSelectedEmotion(null);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Badge variant="secondary" className={selectedEmotion.color}>
              {selectedEmotion.name}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-800 dark:text-blue-200 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6" />
                {devotional.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Reflexão
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {devotional.content}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                  "{devotional.verse}"
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  {devotional.reference}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Oração Pessoal
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line italic">
                    {devotional.prayer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            Como você está se sentindo hoje?
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecione uma emoção e receba um devocional personalizado
          </p>
        </div>

        {generateDevotionalMutation.isPending && (
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300">
                Gerando seu devocional personalizado...
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {emotions?.map((emotion: Emotion) => (
            <Card
              key={emotion.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-blue-300"
              onClick={() => handleEmotionSelect(emotion)}
            >
              <CardHeader className="text-center">
                <div className={`text-4xl mb-2 ${emotion.color}`}>
                  <Heart className="h-12 w-12 mx-auto" />
                </div>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                  {emotion.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {emotion.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}