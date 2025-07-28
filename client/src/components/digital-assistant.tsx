import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Heart, 
  BookOpen, 
  Sparkles,
  Volume2,
  Copy,
  Minimize2,
  Maximize2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

interface AssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  verse?: string;
  reference?: string;
  timestamp: Date;
}

interface AssistantResponse {
  response: string;
  verse: string;
  reference: string;
}

const QUICK_QUESTIONS = [
  "💰 Estou com problemas financeiros",
  "😰 Estou me sentindo ansioso",
  "😢 Preciso de conforto e paz",
  "🙏 Quero uma oração especial",
  "❤️ Preciso sentir o amor de Deus",
  "✨ Quero um versículo motivador",
  "🌅 Como começar bem o dia?",
  "🌙 Oração para dormir em paz"
];

export default function DigitalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<AssistantMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const assistantMutation = useMutation({
    mutationFn: async (userMessage: string): Promise<AssistantResponse> => {
      return apiRequest("/api/digital-assistant", {
        method: "POST",
        body: { 
          userId: user?.id,
          message: userMessage 
        },
      });
    },
    onSuccess: (response: AssistantResponse, userMessage: string) => {
      const assistantMessage: AssistantMessage = {
        id: Date.now().toString() + "_assistant",
        type: 'assistant',
        content: response.response,
        verse: response.verse,
        reference: response.reference,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString() + "_user",
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    assistantMutation.mutate(textToSend);
  };

  const handleQuickQuestion = (question: string) => {
    const cleanQuestion = question.replace(/^[^a-zA-Z]*/, ""); // Remove emojis
    handleSendMessage(cleanQuestion);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para área de transferência.",
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <div className="flex items-center justify-end">
          {/* Label - only show on larger screens and not overlapping */}
          <div className="hidden lg:block bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 mr-2 border max-w-[200px]">
            <span className="text-sm font-medium text-gray-700">IA Cristo - Assistente</span>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl pulse-animation flex-shrink-0"
            size="lg"
            title="IA Cristo - Seu assistente espiritual"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Card className={`w-80 sm:w-96 shadow-2xl border-purple-200 ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/20 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm">IA Cristo</CardTitle>
                <p className="text-xs text-white/80">Assistente Espiritual</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[420px]">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {conversation.length === 0 && (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Olá, {user?.name?.split(' ')[0] || 'irmão'}! 
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Sou a IA Cristo, seu assistente espiritual. Posso gerar versículos instantâneos, 
                      orações personalizadas e mensagens motivacionais para suas necessidades.
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">
                      Pergunte qualquer coisa espiritual
                    </Badge>
                  </div>

                  {/* Quick Questions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Perguntas rápidas:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {QUICK_QUESTIONS.slice(0, 4).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs text-left justify-start h-auto py-2 px-3"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation Messages */}
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    
                    {msg.verse && msg.reference && (
                      <div className="mt-3 p-2 bg-white/10 rounded border-l-2 border-blue-300">
                        <div className="flex items-center gap-1 mb-1">
                          <BookOpen className="h-3 w-3" />
                          <span className="text-xs font-medium">Versículo</span>
                        </div>
                        <p className="text-xs italic mb-1">"{msg.verse}"</p>
                        <p className="text-xs font-semibold">{msg.reference}</p>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(`"${msg.verse}" - ${msg.reference}`)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => speakText(msg.verse || "")}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {msg.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Faça sua pergunta espiritual..."
                  className="text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  disabled={assistantMutation.isPending}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || assistantMutation.isPending}
                  className="bg-purple-500 hover:bg-purple-600"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <style jsx>{`
        @keyframes pulse-animation {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
      `}</style>
    </div>
  );
}