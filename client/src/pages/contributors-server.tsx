import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Award, 
  CheckCircle,
  AlertCircle,
  Loader2
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

export default function ContributorsServer() {
  const [showForm, setShowForm] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Função que usa uma abordagem mais básica
  const handleBasicSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Iniciando cadastro...");
    setMessage(null);
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      donationAmount: formData.get('amount') as string || "50",
      contributionType: "donation",
      specialMessage: formData.get('description') as string || "Gratidão a Deus"
    };
    
    if (!data.name.trim() || !data.email.trim()) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      setStatus("Enviando dados para o servidor...");
      
      // Criar um elemento form temporário para envio direto
      const tempForm = document.createElement('form');
      tempForm.method = 'POST';
      tempForm.action = '/api/contributors';
      tempForm.style.display = 'none';
      
      // Adicionar campos
      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        tempForm.appendChild(input);
      });
      
      document.body.appendChild(tempForm);
      
      // Interceptar o envio
      const submitPromise = new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'submit-frame';
        tempForm.target = 'submit-frame';
        
        iframe.onload = () => {
          try {
            const doc = iframe.contentDocument;
            if (doc) {
              const content = doc.body.textContent;
              if (content) {
                resolve(JSON.parse(content));
              } else {
                reject(new Error('Resposta vazia'));
              }
            } else {
              reject(new Error('Não foi possível acessar resposta'));
            }
          } catch (e) {
            reject(e);
          }
        };
        
        document.body.appendChild(iframe);
        tempForm.submit();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(tempForm);
          document.body.removeChild(iframe);
        }, 5000);
      });
      
      setStatus("Aguardando resposta...");
      const result = await submitPromise as any;
      
      setStatus("Processando certificado...");
      
      setCertificate({
        name: result.contributor?.name || data.name,
        amount: result.contributor?.donationAmount || data.donationAmount,
        exclusivePrayer: result.certificate?.aiGeneratedPrayer || "Oração personalizada gerada",
        exclusiveVerse: result.certificate?.aiGeneratedVerse || "Versículo especial",
        verseReference: result.certificate?.verseReference || "Referência bíblica"
      });
      
      setMessage({ type: 'success', text: 'Cadastro realizado com sucesso!' });
      setShowForm(false);
      form.reset();
      
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: `Erro: ${error.message}. Tente novamente.` 
      });
    } finally {
      setIsSubmitting(false);
      setStatus("");
    }
  };

  // Método que usa fetch para conectar com o servidor
  const handleSimpleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Preparando envio...");
    setMessage(null); // Clear previous messages
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const amount = formData.get('amount') as string || "50";
    const description = formData.get('description') as string || "Gratidão a Deus";
    
    console.log('📝 Dados do formulário:', { name, email, amount, description });
    
    if (!name.trim() || !email.trim()) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      setStatus("Conectando com servidor...");
      
      const requestData = {
        name: name.trim(),
        email: email.trim(),
        donationAmount: amount,
        contributionType: "donation",
        specialMessage: description
      };
      
      setStatus("Enviando dados...");
      
      console.log('🚀 Enviando para:', '/api/contributors');
      console.log('📤 Dados enviados:', requestData);
      
      const response = await fetch('/api/contributors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      console.log('📡 Resposta HTTP:', response.status, response.statusText);
      
      setStatus("Processando resposta do servidor...");
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro do servidor:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: `Erro ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.message || 'Erro de comunicação');
      }
      
      const result = await response.json();
      
      console.log('✅ Resposta do servidor:', result);
      
      // Verificar se a resposta tem os dados necessários
      if (!result.contributor || !result.certificate) {
        throw new Error('Resposta incompleta do servidor');
      }
      
      setStatus("Montando certificado...");
      
      setCertificate({
        name: result.contributor.name,
        amount: result.contributor.donationAmount,
        exclusivePrayer: result.certificate.aiGeneratedPrayer,
        exclusiveVerse: result.certificate.aiGeneratedVerse,
        verseReference: result.certificate.verseReference
      });
      
      setMessage({ type: 'success', text: result.message || 'Certificado gerado com sucesso!' });
      setShowForm(false);
      form.reset();
      
    } catch (error: any) {
      console.error('❌ Erro ao gerar certificado:', error);
      setMessage({ type: 'error', text: `Erro: ${error.message}` });
    } finally {
      setIsSubmitting(false);
      setStatus("");
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
            Gere seu certificado de gratidão
          </p>
        </div>

        {/* Status */}
        {status && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {status}
            </div>
          </div>
        )}

        {/* Mensagem */}
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

        {/* Botão inicial */}
        {!showForm && !certificate && (
          <div className="text-center">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <Gift className="mr-2 h-5 w-5" />
              Iniciar Cadastro
            </Button>
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSimpleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                  <Input name="name" required className="w-full" placeholder="Seu nome" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input name="email" type="email" required className="w-full" placeholder="seu@email.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valor da Doação</label>
                  <Input name="amount" defaultValue="50" className="w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem</label>
                  <Textarea 
                    name="description" 
                    placeholder="Seu testemunho ou mensagem..."
                    rows={3}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Cadastrar e Gerar Certificado'
                    )}
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
                  onClick={() => setCertificate(null)}
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