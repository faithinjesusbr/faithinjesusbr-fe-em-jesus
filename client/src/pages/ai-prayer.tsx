import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, MessageCircle, Sparkles, Book, Heart, ArrowLeft, Home } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

interface AssistantResponse {
  response: string;
  verse?: string;
  reference?: string;
  prayer?: string;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  verse?: string;
  reference?: string;
  timestamp: Date;
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
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const sendPrayerMutation = useMutation({
    mutationFn: async (userMessage: string): Promise<AssistantResponse> => {
      const response = await fetch("/api/digital-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: user.id,
          message: userMessage 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    },
    onSuccess: (data: AssistantResponse, userMessage: string) => {
      // Add user message
      const userMsg: ConversationMessage = {
        id: Date.now().toString() + "_user",
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      
      // Add assistant response
      const assistantMsg: ConversationMessage = {
        id: Date.now().toString() + "_assistant",
        type: 'assistant',
        content: data.response,
        verse: data.verse,
        reference: data.reference,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, userMsg, assistantMsg]);
      setMessage("");
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    sendPrayerMutation.mutate(message);
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    setIsLoading(true);
    sendPrayerMutation.mutate(question);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-20 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Início
            </Button>
          </div>
          
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
          {conversation.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                /* User Message */
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-blue-500 text-white p-4 rounded-lg rounded-br-none">
                    <p>{message.content}</p>
                    <p className="text-xs text-blue-100 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ) : (
                /* AI Response */
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">IA Cristo</span>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg rounded-tl-none">
                      <p className="text-gray-800 leading-relaxed mb-3">{message.content}</p>
                      
                      {message.verse && (
                        <div className="border-l-4 border-purple-500 pl-3 mt-4 bg-purple-50 p-3 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Book className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Versículo</span>
                          </div>
                          <blockquote className="text-purple-700 italic mb-1">
                            "{message.verse}"
                          </blockquote>
                          <p className="text-xs text-purple-600 font-medium">{message.reference}</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-3">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? (
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
      <BottomNav />
    </div>
  );
}