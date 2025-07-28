import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2, Calendar, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";

export default function DailyDevotional() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const { data: devotional, isLoading } = useQuery({
    queryKey: ['/api/user-devotionals', user?.id, today],
    enabled: !!user?.id,
  });

  const generateDevotionalMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest("/api/user-devotionals/generate", "POST", {
        userId: user?.id,
        date: today
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-devotionals'] });
      toast({
        title: "Devocional Gerado!",
        description: "Seu devocional personalizado está pronto.",
      });
      setIsGenerating(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o devocional.",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const playAudio = async () => {
    if (!devotional) return;
    
    setIsPlaying(true);
    try {
      // Usando a Web Speech API para texto para fala
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance();
      
      utterance.text = `
        ${devotional.title}
        
        ${devotional.content}
        
        Versículo: ${devotional.verse}
        ${devotional.reference}
        
        Aplicação prática: ${devotional.application}
      `;
      
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      synth.speak(utterance);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Devocional Diário</h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {!devotional ? (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-4">Gere seu Devocional de Hoje</h2>
                <p className="text-gray-600 mb-6">
                  Receba uma palavra personalizada de Deus com versículo, reflexão e aplicação prática.
                </p>
                <Button 
                  onClick={() => generateDevotionalMutation.mutate()}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gerar Devocional
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-blue-900">{devotional.title}</CardTitle>
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={isPlaying ? stopAudio : playAudio}
                    variant="outline"
                    className="rounded-full"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    {isPlaying ? "Parar" : "Ouvir"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Reflexão</h3>
                  <div className="prose prose-blue max-w-none">
                    {devotional.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Versículo do Dia</h3>
                  <blockquote className="text-blue-800 italic text-lg leading-relaxed mb-2">
                    "{devotional.verse}"
                  </blockquote>
                  <cite className="text-blue-700 font-medium">{devotional.reference}</cite>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Aplicação Prática</h3>
                  <p className="text-green-800 leading-relaxed">{devotional.application}</p>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => generateDevotionalMutation.mutate()}
                    disabled={isGenerating}
                    variant="outline"
                    className="rounded-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Gerar Novo Devocional
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}