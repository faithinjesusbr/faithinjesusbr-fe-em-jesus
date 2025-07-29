import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Gift, Award, Send, Bot, User } from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";

export default function TestSimple() {
  const [step, setStep] = useState("home");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "50",
    description: "teste funcionando"
  });
  const [certificate, setCertificate] = useState<any>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testCertificate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setCertificate(data);
      toast({ title: "Certificado gerado!", description: "Sucesso!" });
    } catch (error) {
      toast({ title: "Erro", description: "Falhou", variant: "destructive" });
    }
    setLoading(false);
  };

  const testAI = async () => {
    if (!chatInput.trim()) return;
    
    setLoading(true);
    const userMsg = { type: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput, type: 'general' })
      });
      const data = await response.json();
      
      const aiMsg = {
        type: 'ai',
        text: data.response,
        verse: data.verse,
        verseRef: data.verseReference,
        source: data.source
      };
      setMessages(prev => [...prev, aiMsg]);
      setChatInput("");
      toast({ title: "IA respondeu!", description: "Sucesso!" });
    } catch (error) {
      const errorMsg = { type: 'ai', text: "Erro na IA" };
      setMessages(prev => [...prev, errorMsg]);
      toast({ title: "Erro", description: "IA falhou", variant: "destructive" });
    }
    setLoading(false);
  };

  if (step === "certificate") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-4 pt-20 pb-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Teste Certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificate ? (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Certificado Gerado!</h3>
                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <h4 className="font-bold">{certificate.name}</h4>
                    <p className="text-sm">{certificate.amount}</p>
                    {certificate.exclusivePrayer && (
                      <div className="mt-2 text-sm">
                        <strong>Oração:</strong> {certificate.exclusivePrayer}
                      </div>
                    )}
                    {certificate.exclusiveVerse && (
                      <div className="mt-2 text-sm">
                        <strong>Versículo:</strong> "{certificate.exclusiveVerse}" - {certificate.verseReference}
                      </div>
                    )}
                  </div>
                  <Button onClick={() => { setCertificate(null); setStep("home"); }} className="mt-4">
                    Voltar
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nome"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Input
                    placeholder="Valor"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Mensagem"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button onClick={testCertificate} disabled={loading} className="flex-1">
                      {loading ? "Gerando..." : "Gerar Certificado"}
                    </Button>
                    <Button variant="outline" onClick={() => setStep("home")}>
                      Voltar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (step === "ai") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-4 pt-20 pb-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Teste IA Cristo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
                {messages.map((msg, i) => (
                  <div key={i} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded max-w-xs ${
                      msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'
                    }`}>
                      <div className="flex items-center gap-1 mb-1">
                        {msg.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        <span className="text-xs">{msg.type === 'user' ? 'Você' : 'IA'}</span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                      {msg.verse && (
                        <div className="mt-1 p-1 bg-yellow-50 rounded text-xs">
                          <strong>Versículo:</strong> "{msg.verse}" - {msg.verseRef}
                        </div>
                      )}
                      {msg.source && (
                        <div className="text-xs opacity-70 mt-1">
                          Fonte: {msg.source}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-center">
                    <Bot className="h-4 w-4 animate-spin mx-auto" />
                    <span className="text-xs">IA pensando...</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && testAI()}
                />
                <Button onClick={testAI} disabled={loading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setChatInput("Como fortalecer minha fé?")}
                >
                  Fortalecer fé
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setChatInput("Preciso de encorajamento")}
                >
                  Encorajamento
                </Button>
              </div>
              <Button onClick={() => setStep("home")} className="w-full mt-4" variant="outline">
                Voltar
              </Button>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto p-4 pt-20 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Teste de Funcionalidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Teste as funcionalidades principais do sistema
            </p>
            
            <Button 
              onClick={() => setStep("certificate")} 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Gift className="h-5 w-5 mr-2" />
              Testar Certificado
            </Button>
            
            <Button 
              onClick={() => setStep("ai")} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Bot className="h-5 w-5 mr-2" />
              Testar IA Cristo
            </Button>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Sistema 100% gratuito com APIs funcionais
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}