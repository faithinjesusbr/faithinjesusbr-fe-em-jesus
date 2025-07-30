import { useState, useEffect } from "react";
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
  CheckCircle
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

export default function ContributorsFallback() {
  const [showForm, setShowForm] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Função para envio direto com JavaScript puro
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      donationAmount: formData.get('amount') as string || "50",
      contributionType: "donation",
      specialMessage: formData.get('description') as string || "Gratidão a Deus"
    };
    
    console.log('📝 Dados do formulário:', data);
    
    if (!data.name.trim() || !data.email.trim()) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    // XMLHttpRequest direto
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        setIsSubmitting(false);
        
        console.log('📊 Status:', xhr.status);
        console.log('📋 Resposta:', xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log('✅ Sucesso:', response);
            
            setCertificate({
              name: response.contributor?.name || data.name,
              amount: response.contributor?.donationAmount || data.donationAmount,
              exclusivePrayer: response.certificate?.aiGeneratedPrayer || "Oração personalizada gerada",
              exclusiveVerse: response.certificate?.aiGeneratedVerse || "Versículo especial",
              verseReference: response.certificate?.verseReference || "Referência bíblica"
            });
            
            setMessage({ type: 'success', text: 'Cadastro realizado com sucesso!' });
            setShowForm(false);
            form.reset();
            
          } catch (e) {
            console.error('❌ Erro no JSON:', e);
            setMessage({ type: 'error', text: 'Erro ao processar resposta do servidor' });
          }
        } else {
          console.error('❌ Erro HTTP:', xhr.status, xhr.responseText);
          setMessage({ type: 'error', text: `Erro no servidor: ${xhr.status}` });
        }
      }
    };
    
    xhr.onerror = function() {
      setIsSubmitting(false);
      console.error('❌ Erro de rede');
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor' });
    };
    
    xhr.open('POST', '/api/contributors', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Formas de Contribuir
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sua contribuição fortalece nossa missão de espalhar a Palavra de Deus
          </p>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Cards de contribuição */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200">
            <CardHeader className="pb-3">
              <DollarSign className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
              <CardTitle className="text-emerald-800 dark:text-emerald-200">Doação Financeira</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Apoie financeiramente nossa missão digital
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardHeader className="pb-3">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-800 dark:text-blue-200">Trabalho Voluntário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ofereça seu tempo e talentos para o Reino
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <CardHeader className="pb-3">
              <Heart className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-800 dark:text-purple-200">Guerreiro de Oração</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Interceda em oração por nosso ministério
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
            <CardHeader className="pb-3">
              <Sparkles className="h-12 w-12 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-orange-800 dark:text-orange-200">Suporte Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Ajude com desenvolvimento e manutenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de cadastro */}
        {!showForm && !certificate && (
          <div className="text-center">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <Gift className="mr-2 h-5 w-5" />
              Cadastrar e Gerar Certificado
            </Button>
          </div>
        )}

        {showForm && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Cadastro de Colaborador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                  <Input name="name" required className="w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input name="email" type="email" required className="w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valor da Doação (opcional)</label>
                  <Input name="amount" defaultValue="50" className="w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem ou Testemunho (opcional)</label>
                  <Textarea 
                    name="description" 
                    placeholder="Compartilhe como Deus tem abençoado sua vida através de nosso ministério..."
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
                    {isSubmitting ? 'Processando...' : 'Cadastrar e Gerar Certificado'}
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

        {/* Certificado gerado */}
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

        {/* Benefícios */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6" />
              Benefícios para Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Certificado Personalizado</h3>
                <p className="text-sm text-gray-600">
                  Certificado com oração exclusiva e versículo especial
                </p>
              </div>
              
              <div className="text-center">
                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Reconhecimento</h3>
                <p className="text-sm text-gray-600">
                  Agradecimento especial em nossa página de colaboradores  
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Bênçãos Eternas</h3>
                <p className="text-sm text-gray-600">
                  Participação no galardão celestial por servir ao Reino
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