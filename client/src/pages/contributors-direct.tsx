import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Award, 
  Sparkles,
  Users,
  Heart,
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";

interface Certificate {
  name: string;
  amount: string;
  exclusivePrayer: string;
  exclusiveVerse: string;
  verseReference: string;
}

export default function ContributorsDirect() {
  const [showForm, setShowForm] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${info}`]);
  };

  const directSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setDebugInfo([]);
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      donationAmount: formData.get('amount') as string || "50",
      contributionType: "donation",
      specialMessage: formData.get('description') as string || "Gratidão a Deus"
    };
    
    addDebugInfo(`Preparando envio: ${data.name}, ${data.email}`);
    
    if (!data.name.trim() || !data.email.trim()) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      addDebugInfo('Iniciando fetch para /api/contributors');
      
      // Usar apenas window.fetch nativo
      const response = await window.fetch('/api/contributors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      addDebugInfo(`Response status: ${response.status}`);
      addDebugInfo(`Response ok: ${response.ok}`);
      
      const responseText = await response.text();
      addDebugInfo(`Response text length: ${responseText.length}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
        addDebugInfo('JSON parsed successfully');
      } catch (e) {
        addDebugInfo('JSON parse failed');
        throw new Error('Resposta inválida do servidor');
      }
      
      addDebugInfo('Cadastro realizado com sucesso');
      
      setCertificate({
        name: result.contributor?.name || data.name,
        amount: result.contributor?.donationAmount || data.donationAmount,
        exclusivePrayer: result.certificate?.aiGeneratedPrayer || "Oração personalizada gerada com sucesso",
        exclusiveVerse: result.certificate?.aiGeneratedVerse || "Versículo especial selecionado",
        verseReference: result.certificate?.verseReference || "Referência bíblica"
      });
      
      setMessage({ type: 'success', text: 'Cadastro realizado com sucesso!' });
      setShowForm(false);
      form.reset();
      
    } catch (error: any) {
      addDebugInfo(`Erro: ${error.message}`);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao processar cadastro' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Cadastro de Colaborador
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sua contribuição fortalece nossa missão
          </p>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <Card className="mb-6 bg-gray-50 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info (Console)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400">
                    {info}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário */}
        {!showForm && !certificate && (
          <div className="text-center">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <Gift className="mr-2 h-5 w-5" />
              Começar Cadastro
            </Button>
          </div>
        )}

        {showForm && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Dados do Colaborador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={directSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                  <Input name="name" required className="w-full" placeholder="Seu nome completo" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input name="email" type="email" required className="w-full" placeholder="seu@email.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valor da Doação (opcional)</label>
                  <Input name="amount" defaultValue="50" className="w-full" placeholder="50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem (opcional)</label>
                  <Textarea 
                    name="description" 
                    placeholder="Compartilhe como Deus tem abençoado sua vida..."
                    rows={4}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isSubmitting ? 'Enviando...' : 'Cadastrar e Gerar Certificado'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Certificado */}
        {certificate && (
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-yellow-600" />
              </div>
              <CardTitle className="text-3xl text-yellow-800 mb-2">
                Certificado de Gratidão
              </CardTitle>
              <Badge className="bg-yellow-600 text-white px-4 py-1">
                Colaborador Oficial
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-gray-700">
                Reconhecemos com gratidão a valiosa contribuição de{" "}
                <span className="font-bold text-yellow-800">{certificate.name}</span>{" "}
                em nossa missão de espalhar a Palavra de Deus.
              </p>
              
              <div className="bg-white/80 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-3">Oração Exclusiva</h3>
                <p className="text-gray-700 italic mb-4">{certificate.exclusivePrayer}</p>
                
                <h3 className="font-semibold text-gray-800 mb-3">Versículo Especial</h3>
                <blockquote className="text-blue-800 font-medium mb-2">
                  "{certificate.exclusiveVerse}"
                </blockquote>
                <cite className="text-blue-600 text-sm">— {certificate.verseReference}</cite>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setCertificate(null);
                    setDebugInfo([]);
                  }}
                  variant="outline"
                >
                  Fazer Novo Cadastro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}