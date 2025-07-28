import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Heart, Send, Sparkles, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import BottomNav from "@/components/bottom-nav";

export default function AIPrayerAgent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userMessage, setUserMessage] = useState("");
  const [generatedPrayer, setGeneratedPrayer] = useState(null);

  const generatePrayerMutation = useMutation({
    mutationFn: async (message) => {
      const response = await apiRequest("/api/ai-prayer/generate", "POST", {
        userId: user?.id,
        userMessage: message
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratedPrayer(data);
      toast({
        title: "Oração Gerada!",
        description: "Sua oração personalizada está pronta.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a oração. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleGeneratePrayer = () => {
    if (!userMessage.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva como você está se sentindo.",
        variant: "destructive",
      });
      return;
    }

    generatePrayerMutation.mutate(userMessage);
  };

  const handleNewPrayer = () => {
    setGeneratedPrayer(null);
    setUserMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-rose-600" />
              <h1 className="text-3xl font-bold text-gray-900">Agente de Oração com IA</h1>
            </div>
            <p className="text-gray-600">
              Compartilhe seus sentimentos e receba uma oração personalizada
            </p>
          </div>

          {!generatedPrayer ? (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-rose-600" />
                  Como você está se sentindo?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Descreva seus sentimentos, preocupações, alegrias ou necessidades de oração
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="userMessage" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Compartilhe com Deus
                  </Label>
                  <Textarea
                    id="userMessage"
                    placeholder="Exemplo: Estou passando por um momento difícil no trabalho e me sinto ansioso sobre o futuro. Preciso de paz e direção..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">Seus dados são seguros</h3>
                      <p className="text-sm text-blue-700">
                        Suas informações são utilizadas apenas para gerar uma oração personalizada 
                        e não são compartilhadas com terceiros.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGeneratePrayer}
                  disabled={generatePrayerMutation.isPending || !userMessage.trim()}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 rounded-full shadow-lg"
                >
                  {generatePrayerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Oração...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gerar Oração
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-rose-900 flex items-center justify-center gap-2">
                    <Heart className="h-6 w-6" />
                    Sua Oração Personalizada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-rose-50 rounded-lg p-6">
                    <h3 className="font-semibold text-rose-900 mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Oração
                    </h3>
                    <div className="prose prose-rose max-w-none">
                      {generatedPrayer.aiResponse.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-rose-800 leading-relaxed mb-3 italic">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {generatedPrayer.verse && (
                    <div className="bg-teal-50 rounded-lg p-6">
                      <h3 className="font-semibold text-teal-900 mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Versículo de Apoio
                      </h3>
                      <blockquote className="text-teal-800 italic text-lg leading-relaxed mb-2">
                        "{generatedPrayer.verse}"
                      </blockquote>
                      <cite className="text-teal-700 font-medium">{generatedPrayer.reference}</cite>
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-lg p-6">
                    <h3 className="font-semibold text-amber-900 mb-3">Lembre-se</h3>
                    <p className="text-amber-800 leading-relaxed">
                      Deus ouve cada palavra de seu coração. Continue buscando-O em oração, 
                      sabendo que Ele tem o melhor para você. Esta oração é apenas um guia - 
                      sinta-se livre para falar com Deus com suas próprias palavras.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleNewPrayer}
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Nova Oração
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Original Message */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-700">Sua Mensagem Original</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic leading-relaxed">
                    "{userMessage}"
                  </p>
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