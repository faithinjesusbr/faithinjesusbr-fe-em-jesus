import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, MessageCircle, Sparkles, Book, Heart } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AIPrayerRequest {
  id: string;
  userMessage: string;
  aiResponse: string;
  verse?: string;
  reference?: string;
  createdAt: string;
}

const quickQuestions = [
  "Como posso ter mais fé?",
  "Preciso de oração pela minha família",
  "Estou passando por dificuldades financeiras",
  "Como superar a ansiedade?",
  "Preciso de sabedoria para tomar uma decisão",
  "Como perdoar alguém que me machucou?",
  "Estou sentindo solidão",
  "Como ter paz em meio às tribulações?",
];

export default function AIPrayerPage() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<AIPrayerRequest[]>([]);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: prayerHistory } = useQuery({
    queryKey: ["/api/ai-prayer", user.id],
    enabled: !!user.id,
  });

  const sendPrayerMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      return apiRequest("/api/ai-prayer", {
        method: "POST",
        body: {
          userId: user.id,
          userMessage,
          aiResponse: "", // Será preenchido pelo backend
        },
      });
    },
    onSuccess: (data) => {
      setConversation(prev => [...prev, data]);
      setMessage("");
      toast({
        title: "Resposta Recebida",
        description: "IA Cristo respondeu à sua oração.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendPrayerMutation.mutate(message);
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            IA Cristo
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Converse com nosso assistente espiritual e receba orientação baseada na Palavra de Deus
        </p>
      </div>

      {/* Quick Questions */}
      {conversation.length === 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Perguntas Rápidas
            </CardTitle>
            <CardDescription>
              Toque em uma pergunta para começar rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-3 justify-start hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => handleQuickQuestion(question)}
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation */}
      <div className="space-y-6 mb-8">
        {conversation.map((item, index) => (
          <div key={index} className="space-y-4">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-blue-500 text-white p-4 rounded-lg rounded-br-none">
                <p>{item.userMessage}</p>
                <p className="text-xs text-blue-100 mt-2">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">IA Cristo</span>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg rounded-tl-none">
                  <p className="text-gray-800 leading-relaxed mb-3">{item.aiResponse}</p>
                  
                  {item.verse && (
                    <div className="border-l-4 border-purple-500 pl-3 mt-4 bg-purple-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Versículo</span>
                      </div>
                      <blockquote className="text-purple-700 italic mb-1">
                        "{item.verse}"
                      </blockquote>
                      <p className="text-xs text-purple-600 font-medium">{item.reference}</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            
            {index < conversation.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <Card className="sticky bottom-4">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Compartilhe sua oração ou dúvida espiritual..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={sendPrayerMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendPrayerMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {sendPrayerMutation.isPending ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            IA Cristo está aqui para oferecer orientação espiritual baseada na Bíblia
          </p>
        </CardContent>
      </Card>

      {/* Prayer History */}
      {prayerHistory && prayerHistory.length > 0 && conversation.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Conversas Anteriores
            </CardTitle>
            <CardDescription>
              Suas últimas conversas com IA Cristo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prayerHistory.slice(0, 5).map((item: AIPrayerRequest) => (
                <div
                  key={item.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setConversation([item])}
                >
                  <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                    {item.userMessage}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()} às{" "}
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-none">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Como usar IA Cristo
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Compartilhe suas orações e receba versículos relacionados</li>
            <li>• Faça perguntas sobre fé, vida cristã e crescimento espiritual</li>
            <li>• Peça conselhos baseados na Palavra de Deus</li>
            <li>• Use as perguntas rápidas para começar facilmente</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}