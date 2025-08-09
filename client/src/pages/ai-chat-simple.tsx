import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, BookOpen, Heart } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import BackButton from "@/components/back-button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  verse?: string;
  verseRef?: string;
  source?: string;
}

export default function AIChatSimple() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Olá! Sou seu assistente espiritual. Como posso ajudá-lo hoje?'
    }
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type: 'general' })
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        text: data.response || "Desculpe, não consegui responder.",
        verse: data.verse,
        verseRef: data.verseReference,
        source: data.source
      };
      setMessages(prev => [...prev, aiMessage]);
      toast({
        title: "Resposta recebida",
        description: "Assistente respondeu sua pergunta"
      });
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        text: "Deus está sempre presente para te guiar. Você não está sozinho."
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Enviar para IA
    sendMutation.mutate(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            IA Cristo - Assistente Espiritual
          </h1>
          <p className="text-lg text-gray-600">
            Converse com nosso assistente de IA para orientação espiritual
          </p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat Espiritual
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages */}
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
                      <div className="flex items-start gap-2">
                        {msg.type === 'user' ? (
                          <User className="h-4 w-4 mt-1" />
                        ) : (
                          <Bot className="h-4 w-4 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{msg.text}</p>
                          
                          {/* Versículo */}
                          {msg.verse && msg.verseRef && (
                            <div className="mt-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                              <div className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-amber-600 mt-1" />
                                <div>
                                  <blockquote className="text-sm italic text-amber-800">
                                    "{msg.verse}"
                                  </blockquote>
                                  <cite className="text-xs text-amber-700 font-medium">
                                    {msg.verseRef}
                                  </cite>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Source */}
                          {msg.source && msg.type === 'ai' && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {msg.source}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sendMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-lg rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="text-sm">Digitando...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={sendMutation.isPending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || sendMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3 text-xs text-gray-500 text-center">
                Sistema 100% gratuito com fallbacks inteligentes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Perguntas Rápidas:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Como lidar com ansiedade?",
              "Preciso de encorajamento",
              "Como fortalecer minha fé?",
              "Me sinto sozinho"
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(question);
                  const userMsg: Message = {
                    id: Date.now().toString(),
                    type: 'user',
                    text: question
                  };
                  setMessages(prev => [...prev, userMsg]);
                  sendMutation.mutate(question);
                }}
                disabled={sendMutation.isPending}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}