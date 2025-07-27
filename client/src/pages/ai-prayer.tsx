import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, MessageCircle, Heart, BookOpen, Send } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface AIPrayerRequest {
  id: string;
  userId: string;
  userMessage: string;
  aiResponse: string;
  verse?: string;
  reference?: string;
  createdAt: string;
}

export default function AIPrayerPage() {
  const [message, setMessage] = useState("");
  const [currentResponse, setCurrentResponse] = useState<AIPrayerRequest | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prayerHistory } = useQuery({
    queryKey: ["/api/ai-prayer", user?.id],
    enabled: !!user,
  });

  const sendPrayerMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      return apiRequest("/api/ai-prayer", {
        method: "POST",
        body: {
          userId: user?.id,
          userMessage,
        },
      });
    },
    onSuccess: (data) => {
      setCurrentResponse(data);
      setMessage("");
      queryClient.invalidateQueries({
        queryKey: ["/api/ai-prayer", user?.id],
      });
      toast({
        title: "Oração recebida!",
        description: "Sua oração personalizada foi gerada com amor.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para usar o Agente de Oração.",
        variant: "destructive",
      });
      return;
    }
    sendPrayerMutation.mutate(message.trim());
  };

  if (currentResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-950 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentResponse(null)}
              className="text-rose-600 hover:text-rose-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-rose-800 dark:text-rose-200 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6" />
                Sua Oração Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Você compartilhou:
                </h3>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{currentResponse.userMessage}"
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Oração para Você
                </h3>
                <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {currentResponse.aiResponse}
                  </p>
                </div>
              </div>

              {currentResponse.verse && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Versículo de Encorajamento
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                    "{currentResponse.verse}"
                  </p>
                  {currentResponse.reference && (
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {currentResponse.reference}
                    </p>
                  )}
                </div>
              )}

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Gerado em {new Date(currentResponse.createdAt).toLocaleString("pt-BR")}
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button
              onClick={() => setCurrentResponse(null)}
              className="bg-rose-600 hover:bg-rose-700 text-white mr-4"
            >
              Fazer Novo Pedido
            </Button>
            <Link href="/">
              <Button variant="outline">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-800 dark:text-rose-200 mb-2">
            Agente de Oração com IA
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compartilhe seus sentimentos e receba uma oração personalizada
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prayer Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-rose-800 dark:text-rose-200 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Como você está se sentindo?
                </CardTitle>
                <CardDescription>
                  Compartilhe seus pensamentos, preocupações ou alegrias. Nosso agente de IA criará uma oração especial para você.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite aqui o que está em seu coração... Por exemplo: 'Estou ansioso com meu trabalho' ou 'Grato pelas bênçãos da semana'"
                    className="min-h-32 resize-none"
                    disabled={sendPrayerMutation.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || sendPrayerMutation.isPending}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {sendPrayerMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Gerando oração...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Solicitar Oração
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Prayer History */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                  Suas Orações Anteriores
                </CardTitle>
                <CardDescription>
                  Reveja suas conversas com o agente de oração
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Faça login para ver seu histórico de orações
                  </p>
                ) : !prayerHistory || prayerHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Ainda não há orações. Faça sua primeira solicitação!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {prayerHistory.slice(0, 5).map((prayer: AIPrayerRequest) => (
                      <div
                        key={prayer.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setCurrentResponse(prayer)}
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-1">
                          "{prayer.userMessage}"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(prayer.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline" className="text-rose-600 border-rose-300 hover:bg-rose-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}