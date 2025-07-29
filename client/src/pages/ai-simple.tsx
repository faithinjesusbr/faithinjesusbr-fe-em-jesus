import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

export default function AISimplePage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/digital-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: "test-user", 
          message: message 
        }),
      });
      
      const data = await res.json();
      setResponse(data.response || "Erro na resposta");
      setMessage("");
    } catch (error) {
      setResponse("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={() => setLocation('/')} 
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                IA Cristo - Teste Simples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua pergunta..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={!message.trim() || isLoading}>
                  {isLoading ? "..." : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              {response && (
                <div className="p-4 bg-blue-50 rounded border">
                  <p className="text-sm text-gray-700">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}