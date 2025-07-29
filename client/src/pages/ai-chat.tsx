import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, Send, Sparkles, Heart, RefreshCw,
  Bot, User, BookOpen, Lightbulb
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  verse?: string;
  verseReference?: string;
  confidence?: string;
  source?: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  { text: "Como lidar com a ansiedade?", type: "advice" },
  { text: "Preciso de uma palavra de encorajamento", type: "encouragement" },
  { text: "Estou passando por dificuldades", type: "general" },
  { text: "Como fortalecer minha fé?", type: "advice" },
  { text: "Me sinto sozinho", type: "general" },
  { text: "Dicas para oração", type: "advice" }
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: 'Olá! Sou seu assistente espiritual. Como posso ajudá-lo hoje? Você pode me fazer perguntas sobre fé, pedir conselhos bíblicos ou simplesmente conversar.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; type?: string }) => {
      return apiRequest("/api/ai-assistant", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: data.response,
        verse: data.verse,
        verseReference: data.verseReference,
        confidence: data.confidence,
        source: data.source,
        timestamp: data.timestamp
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Resposta recebida",
        description: `Assistente respondeu com ${data.confidence === 'high' ? 'alta' : data.confidence === 'medium' ? 'média' : 'baixa'} confiança`,
      });
    },
    onError: () => {
      // Mesmo com erro, dar uma resposta de fallback
      const fallbackMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: 'Deus conhece seu coração e suas necessidades. Ele está sempre presente para te guiar. Lembre-se de que você não está sozinho nesta jornada.',
        verse: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.',
        verseReference: 'Jeremias 29:11',
        confidence: 'low',
        source: 'Fallback Local',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Resposta Disponível",
        description: "Aqui está uma palavra de encorajamento para você.",
      });
    },
  });

  const handleSendMessage = (message?: string, type?: string) => {
    const messageToSend = message || inputMessage.trim();
    
    if (!messageToSend) return;

    // Adicionar mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: messageToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    
    // Enviar para IA
    sendMessageMutation.mutate({
      message: messageToSend,
      type: type || 'general'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assistente IA Cristão
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Converse com nosso assistente espiritual gratuito. Faça perguntas sobre fé, 
            peça conselhos bíblicos ou receba palavras de encorajamento.
          </p>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Perguntas Rápidas:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {QUICK_QUESTIONS.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(question.text, question.type)}
                disabled={sendMessageMutation.isPending}
                className="text-left justify-start h-auto py-3 px-4 hover:bg-blue-50 hover:border-blue-300"
              >
                <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{question.text}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Chat Espiritual
            </CardTitle>
            <CardDescription className="text-blue-100">
              {sendMessageMutation.isPending ? "Processando sua mensagem..." : "Digite sua mensagem abaixo"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-96 p-6">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {msg.type === 'user' ? (
                          <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        ) : (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          
                          {/* AI Response Metadata */}
                          {msg.type === 'ai' && (msg.confidence || msg.source) && (
                            <div className="mt-2 flex items-center gap-2">
                              {msg.confidence && (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    msg.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                    msg.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {msg.confidence === 'high' ? 'Alta confiança' :
                                   msg.confidence === 'medium' ? 'Média confiança' : 'Baixa confiança'}
                                </Badge>
                              )}
                              {msg.source && (
                                <Badge variant="outline" className="text-xs">
                                  {msg.source === 'huggingface' ? 'IA Online' : 
                                   msg.source === 'Offline Inteligente' ? 'IA Local' : 'Base Local'}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* Bible Verse */}
                          {msg.verse && msg.verseReference && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                              <div className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                                <div>
                                  <blockquote className="text-sm italic text-amber-800">
                                    "{msg.verse}"
                                  </blockquote>
                                  <cite className="text-xs text-amber-700 font-medium">
                                    {msg.verseReference}
                                  </cite>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-lg rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={sendMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>Pressione Enter para enviar</span>
                <span className="flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  IA gratuita com fallbacks inteligentes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}