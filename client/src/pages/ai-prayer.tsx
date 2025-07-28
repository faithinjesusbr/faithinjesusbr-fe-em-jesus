import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, MessageCircle, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { apiRequest } from "@/lib/queryClient";

export default function AIPrayer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([]);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("/api/ai-prayer/chat", "POST", {
        userId: user?.id,
        message: message
      });
      return response;
    },
    onSuccess: (data) => {
      // Add AI response to conversation
      setConversation(prev => [...prev, {
        id: Date.now().toString() + '_ai',
        type: 'ai',
        content: data.response || "Que Deus te abençoe! Como posso te ajudar hoje?",
        timestamp: new Date()
      }]);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // Add user message to conversation
    const userMsg = {
      id: Date.now().toString() + '_user',
      type: 'user' as const,
      content: userMessage,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMsg]);
    sendMessageMutation.mutate(userMessage);
    setUserMessage("");
  };

  const quickQuestions = [
    "Como posso ter mais fé hoje?",
    "Preciso de oração para decidir algo",
    "Preciso de uma palavra de ânimo",
    "Como posso perdoar alguém?",
    "Estou passando por dificuldades",
    "Que seja desencorajado",
    "Preciso de uma palaver de ânimo",
    "Como posso perdoar alguém?"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">IA Cristo</h1>
          <p className="text-gray-600">Compartilhe seus sentimentos e receba palavras de fé</p>
        </div>

        {/* Quick Questions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Perguntas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto py-3 px-4 text-sm"
                  onClick={() => setUserMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Como posso te abençoar hoje?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600">Compartilhe seus sentimentos, dúvidas ou pedidos de oração</p>
                </div>
              ) : (
                conversation.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs ${
                        msg.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Compartilhe seus sentimentos, dúvidas ou pedidos de oração..."
                className="flex-1 min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userMessage.trim() || sendMessageMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {sendMessageMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-800 mb-1">Como você está se sentindo espiritualmente?</p>
                <p className="text-xs text-blue-600">
                  O Cristo e te escuta sempre. Conte que a oração exigente que você está.
                  Conte um momento que você precisou de auxílio espiritual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}