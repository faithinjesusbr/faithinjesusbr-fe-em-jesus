import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Heart, 
  Gift,
  Copy,
  Star,
  Award,
  DollarSign,
  HandHeart,
  Code,
  PrayingHands,
  CheckCircle2,
  Sparkles,
  Download,
  Share2
} from "lucide-react";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PixContributorsPage() {
  const [contributorData, setContributorData] = useState({
    name: "",
    email: "",
    contributionType: "donation",
    amount: "",
    message: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contributionTypes = [
    { 
      id: "donation", 
      label: "💰 Doação Financeira", 
      icon: DollarSign, 
      color: "bg-green-100 text-green-800 border-green-300",
      description: "Apoie financeiramente nosso ministério digital"
    },
    { 
      id: "volunteer", 
      label: "🤝 Trabalho Voluntário", 
      icon: HandHeart, 
      color: "bg-blue-100 text-blue-800 border-blue-300",
      description: "Ofereça seu tempo e talentos para o Reino"
    },
    { 
      id: "prayer", 
      label: "🙏 Guerreiro de Oração", 
      icon: PrayingHands, 
      color: "bg-purple-100 text-purple-800 border-purple-300",
      description: "Interceda em oração por nosso ministério"
    },
    { 
      id: "tech", 
      label: "💻 Suporte Técnico", 
      icon: Code, 
      color: "bg-orange-100 text-orange-800 border-orange-300",
      description: "Ajude com desenvolvimento e manutenção"
    }
  ];

  const submitContributorMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/contributors", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (response) => {
      setGeneratedCertificate(response.certificate);
      setShowSuccessModal(true);
      setContributorData({
        name: "",
        email: "",
        contributionType: "donation",
        amount: "",
        message: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      toast({
        title: "Cadastro Realizado!",
        description: "Seu certificado personalizado foi gerado com IA.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível processar seu cadastro. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorData.name || !contributorData.email) {
      toast({
        title: "Dados Incompletos",
        description: "Por favor, preencha pelo menos nome e email.",
        variant: "destructive",
      });
      return;
    }
    submitContributorMutation.mutate(contributorData);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("faithinjesuseua@gmail.com");
    toast({
      title: "PIX Copiado!",
      description: "Chave PIX copiada para área de transferência.",
    });
  };

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Certificado - Fé em Jesus BR",
        text: "Recebi um certificado personalizado por contribuir com o ministério Fé em Jesus BR!",
        url: window.location.href
      });
    } else {
      toast({
        title: "Link Copiado",
        description: "Link do certificado copiado para compartilhar.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seja um Colaborador
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Faça parte da nossa missão de espalhar a Palavra de Deus digitalmente. 
            Sua contribuição, seja financeira, voluntária, em oração ou técnica, é uma bênção!
          </p>
        </div>

        {/* PIX Information */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              💳 Chave PIX Oficial
            </h3>
            <div className="bg-white p-4 rounded-lg border border-green-300 mb-4">
              <p className="text-lg font-mono text-gray-800 mb-2">
                faithinjesuseua@gmail.com
              </p>
              <Button 
                onClick={copyPixKey}
                className="bg-green-600 hover:bg-green-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Chave PIX
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Após fazer sua doação, preencha o formulário abaixo para receber seu certificado personalizado!
            </p>
          </CardContent>
        </Card>

        {/* Contribution Types */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">
              🎯 Formas de Contribuir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contributionTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    contributorData.contributionType === type.id
                      ? type.color
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setContributorData(prev => ({ ...prev, contributionType: type.id }))}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <type.icon className="h-6 w-6" />
                    <h4 className="font-semibold">{type.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Cadastro de Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    value={contributorData.name}
                    onChange={(e) => setContributorData(prev => ({ ...prev, name: e.target.value }))}
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
                    value={contributorData.email}
                    onChange={(e) => setContributorData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {contributorData.contributionType === "donation" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Doação (opcional)
                  </label>
                  <Input
                    value={contributorData.amount}
                    onChange={(e) => setContributorData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Ex: R$ 50,00"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem ou Testemunho (opcional)
                </label>
                <Textarea
                  value={contributorData.message}
                  onChange={(e) => setContributorData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Compartilhe como Deus tocou seu coração para contribuir..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={submitContributorMutation.isPending}
              >
                {submitContributorMutation.isPending ? (
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Gift className="h-4 w-4 mr-2" />
                )}
                {submitContributorMutation.isPending ? "Gerando Certificado..." : "Cadastrar e Gerar Certificado"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              🎁 Benefícios para Colaboradores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Certificado Personalizado</h4>
                <p className="text-sm text-gray-600">Gerado por IA com versículo e oração exclusivos</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Reconhecimento</h4>
                <p className="text-sm text-gray-600">Aparição na página de colaboradores</p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Bênçãos Eternas</h4>
                <p className="text-sm text-gray-600">Participação na obra de evangelização</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />

      {/* Success Modal with Certificate */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              🎉 Certificado Gerado com Sucesso!
            </DialogTitle>
          </DialogHeader>
          
          {generatedCertificate && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg border-2 border-purple-200">
              <div className="text-center space-y-6">
                <div className="border-b-2 border-purple-300 pb-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🏆 Certificado de Gratidão
                  </h2>
                  <p className="text-lg text-gray-600">
                    Ministério Fé em Jesus BR
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-purple-700">
                    {contributorData.name}
                  </h3>
                  
                  <Badge className="px-4 py-2 text-sm bg-purple-100 text-purple-800">
                    Colaborador: {contributionTypes.find(t => t.id === contributorData.contributionType)?.label}
                  </Badge>

                  <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
                    {generatedCertificate.description}
                  </p>

                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-lg italic text-gray-800 mb-2">
                      "{generatedCertificate.aiGeneratedVerse}"
                    </p>
                    <p className="text-sm font-semibold text-purple-600">
                      {generatedCertificate.verseReference}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-700 mb-2">🙏 Oração de Bênção:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {generatedCertificate.aiGeneratedPrayer}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-500 pt-4 border-t border-purple-200">
                  <p>Fé em Jesus BR - Aplicativo Cristão</p>
                  <p>{new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={shareCertificate}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Salvar PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}