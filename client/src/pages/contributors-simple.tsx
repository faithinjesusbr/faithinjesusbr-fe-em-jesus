import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Contributor {
  id: string;
  name: string;
  email: string;
  amount: string;
  description: string;
  exclusivePrayer?: string;
  exclusiveVerse?: string;
  verseReference?: string;
  createdAt: string;
}

export default function ContributorsSimple() {
  const [showForm, setShowForm] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "50",
    description: "amem deus abençoe"
  });
  const { toast } = useToast();

  const { data: contributors, isLoading } = useQuery({
    queryKey: ["/api/contributors"],
  });

  const [submitting, setSubmitting] = useState(false);

  const handleDirectSubmit = async (data: any) => {
    setSubmitting(true);
    
    try {
      console.log('🚀 MÉTODO DIRETO - Enviando:', data);
      
      // Usar apenas XMLHttpRequest que funciona melhor
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            console.log('📊 XHR Status:', xhr.status);
            console.log('📋 XHR Response:', xhr.responseText);
            
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch (e) {
                reject(new Error('Resposta inválida do servidor'));
              }
            } else {
              reject(new Error(`Erro ${xhr.status}: ${xhr.responseText}`));
            }
          }
        };
        
        xhr.onerror = () => {
          console.error('❌ XHR Error');
          reject(new Error('Erro de conexão'));
        };
        
        xhr.open('POST', '/api/contributors', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      });
      
      console.log('✅ CADASTRO REALIZADO:', result);
      
      // Sucesso - atualizar interface
      setCertificate({
        name: (result as any).contributor?.name || data.name,
        amount: (result as any).contributor?.donationAmount || data.donationAmount,
        exclusivePrayer: (result as any).certificate?.aiGeneratedPrayer,
        exclusiveVerse: (result as any).certificate?.aiGeneratedVerse,
        verseReference: (result as any).certificate?.verseReference
      });
      
      toast({
        title: "Cadastro Realizado!",
        description: "Seu certificado foi gerado com sucesso.",
      });
      
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        amount: "50",
        description: "amem deus abençoe"
      });
      
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      
    } catch (error: any) {
      console.error('💥 ERRO FINAL:', error);
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível processar seu cadastro.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitMutation = {
    mutate: handleDirectSubmit,
    isPending: submitting
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Formulário submetido com dados:', formData);
    
    if (!formData.name.trim() || !formData.email.trim()) {
      console.log('Validação falhou: campos obrigatórios vazios');
      toast({
        title: "Dados Incompletos",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      donationAmount: formData.amount || "50",
      contributionType: "donation",
      specialMessage: formData.description.trim() || "Gratidão a Deus"
    };
    
    console.log('Dados a serem enviados:', submitData);
    submitMutation.mutate(submitData);
  };

  if (certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Certificado Gerado!
            </h1>
            <p className="text-gray-600 text-lg">
              Obrigado por apoiar nosso ministério
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-divine-700">
                <Award className="w-8 h-8 mx-auto mb-2" />
                Certificado de Colaborador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {certificate.name}
                </h3>
                <p className="text-gray-600">Contribuição: {certificate.amount}</p>
              </div>

              {certificate.exclusivePrayer && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-700 mb-2">Oração Exclusiva:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {certificate.exclusivePrayer}
                  </p>
                </div>
              )}

              {certificate.exclusiveVerse && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-700 mb-2">Versículo Especial:</h4>
                  <blockquote className="text-gray-700 italic">
                    "{certificate.exclusiveVerse}"
                  </blockquote>
                  {certificate.verseReference && (
                    <cite className="text-sm font-medium text-amber-600">
                      {certificate.verseReference}
                    </cite>
                  )}
                </div>
              )}

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Fé em Jesus BR - {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <Button
                onClick={() => setCertificate(null)}
                className="w-full"
              >
                Voltar à Página Principal
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-divine-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Colaboradores
          </h1>
          <p className="text-lg text-gray-600">
            Pessoas especiais que contribuem para nossa missão
          </p>
        </div>

        {/* Existing Contributors */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-divine-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando colaboradores...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.isArray(contributors) ? contributors.slice(0, 6).map((contributor: Contributor) => (
              <Card key={contributor.id} className="border border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{contributor.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Colaborador
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {contributor.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      {contributor.amount}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(contributor.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )) : null}
          </div>
        )}

        {/* Call to Action */}
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <Gift className="h-12 w-12 text-divine-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Faça Parte da Nossa Missão
            </h3>
            <p className="text-gray-700 mb-6">
              Contribua para espalhar a Palavra de Deus e receba seu certificado personalizado
            </p>
            
            {!showForm ? (
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowForm(true)}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Cadastrar e Gerar Certificado
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Doação (opcional)
                  </label>
                  <Input
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem (opcional)
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Compartilhe como Deus tocou seu coração..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="flex-1 bg-divine-600 hover:bg-divine-700"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Gerando Certificado...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        Gerar Certificado
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
}