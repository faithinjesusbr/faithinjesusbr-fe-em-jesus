import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Gift, Heart, DollarSign, Award, Copy, CheckCircle, 
  Star, Sparkles, Users, Zap, Crown 
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ContributorFormData {
  name: string;
  email: string;
  contributionType: string;
  amount: string;
  message: string;
}

const contributionTypes = [
  {
    value: "monthly_supporter",
    label: "Apoiador Mensal",
    description: "Contribuição mensal recorrente",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    value: "one_time_donation",
    label: "Doação Única",
    description: "Contribuição pontual",
    icon: Gift,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    value: "ministry_partner",
    label: "Parceiro do Ministério",
    description: "Apoio estratégico e contínuo",
    icon: Crown,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
];

const contributionAmounts = [
  { value: "10", label: "R$ 10" },
  { value: "25", label: "R$ 25" },
  { value: "50", label: "R$ 50" },
  { value: "100", label: "R$ 100" },
  { value: "250", label: "R$ 250" },
  { value: "custom", label: "Outro valor" },
];

export default function PixSupportPage() {
  const [formData, setFormData] = useState<ContributorFormData>({
    name: "",
    email: "",
    contributionType: "one_time_donation",
    amount: "",
    message: "",
  });
  const [customAmount, setCustomAmount] = useState("");
  const [certificate, setCertificate] = useState<any>(null);
  const { toast } = useToast();

  const { data: contributors } = useQuery({
    queryKey: ["/api/contributors"],
  });

  const createContributorMutation = useMutation({
    mutationFn: async (data: ContributorFormData) => {
      return apiRequest("/api/contributors", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      setCertificate(data.certificate);
      queryClient.invalidateQueries({ queryKey: ["/api/contributors"] });
      toast({
        title: "Obrigado pelo seu apoio! 🙏",
        description: "Seu certificado de contribuidor foi gerado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua contribuição. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ContributorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const finalAmount = formData.amount === "custom" ? customAmount : formData.amount;
    
    if (!formData.name || !formData.email || !finalAmount) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createContributorMutation.mutate({
      ...formData,
      amount: finalAmount,
    });
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("faithinjesuseua@gmail.com");
    toast({
      title: "PIX copiado!",
      description: "Chave PIX copiada para área de transferência.",
    });
  };

  const selectedContributionType = contributionTypes.find(
    type => type.value === formData.contributionType
  );

  if (certificate) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Contribuição Confirmada!
          </h1>
          <p className="text-gray-600 text-lg">
            Obrigado por apoiar nosso ministério
          </p>
        </div>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-800">
              <Award className="h-6 w-6" />
              Certificado de Contribuidor
            </CardTitle>
            <CardDescription>
              Seu certificado personalizado foi gerado com IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-center mb-4 text-green-800">
                {certificate.title}
              </h3>
              <p className="text-center text-gray-700 mb-4">
                {certificate.description}
              </p>
              
              {certificate.aiGeneratedVerse && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                  <blockquote className="text-blue-700 italic text-center">
                    "{certificate.aiGeneratedVerse}"
                  </blockquote>
                  <p className="text-sm text-blue-600 font-medium text-center mt-2">
                    {certificate.verseReference}
                  </p>
                </div>
              )}

              {certificate.aiGeneratedPrayer && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold mb-2 text-green-800">
                    Oração Personalizada:
                  </h4>
                  <p className="text-green-700 italic">
                    {certificate.aiGeneratedPrayer}
                  </p>
                </div>
              )}

              <div className="text-center mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Emitido em {new Date(certificate.issuedAt).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-green-700">
                  Fé em Jesus BR - Ministério Digital
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setCertificate(null)}
                variant="outline"
                className="flex-1"
              >
                Nova Contribuição
              </Button>
              <Button
                onClick={() => {
                  const certificateText = `${certificate.title}\n\n${certificate.description}\n\n"${certificate.aiGeneratedVerse}"\n- ${certificate.verseReference}\n\nOração: ${certificate.aiGeneratedPrayer}`;
                  navigator.clipboard.writeText(certificateText);
                  toast({ title: "Copiado!", description: "Certificado copiado para área de transferência." });
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Compartilhar Certificado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Apoiar Ministério
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Sua contribuição nos ajuda a levar a Palavra de Deus através da tecnologia
        </p>
      </div>

      {/* PIX Information */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-2">PIX para Doações</h3>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200 inline-block">
              <p className="text-lg font-mono text-green-700 mb-2">
                faithinjesuseua@gmail.com
              </p>
              <Button onClick={copyPixKey} size="sm" className="bg-green-600 hover:bg-green-700">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Chave PIX
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Após fazer sua contribuição via PIX, preencha o formulário abaixo para receber seu certificado
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Dados do Contribuidor
          </CardTitle>
          <CardDescription>
            Preencha seus dados para receber certificado personalizado com IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          {/* Contribution Type */}
          <div className="space-y-3">
            <Label>Tipo de Contribuição *</Label>
            <RadioGroup
              value={formData.contributionType}
              onValueChange={(value) => handleInputChange("contributionType", value)}
            >
              {contributionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label 
                      htmlFor={type.value} 
                      className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className={`p-2 rounded-full ${type.bgColor}`}>
                        <Icon className={`h-4 w-4 ${type.color}`} />
                      </div>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <Label>Valor da Contribuição *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contributionAmounts.map((amount) => (
                <Button
                  key={amount.value}
                  variant={formData.amount === amount.value ? "default" : "outline"}
                  className={`h-12 ${
                    formData.amount === amount.value 
                      ? "bg-green-600 hover:bg-green-700" 
                      : ""
                  }`}
                  onClick={() => handleInputChange("amount", amount.value)}
                >
                  {amount.label}
                </Button>
              ))}
            </div>
            
            {formData.amount === "custom" && (
              <Input
                placeholder="Digite o valor (ex: 75)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                type="number"
                min="1"
              />
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Compartilhe uma mensagem ou pedido de oração..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={createContributorMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
          >
            {createContributorMutation.isPending ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Gerando Certificado...
              </>
            ) : (
              <>
                <Award className="w-5 h-5 mr-2" />
                Confirmar Contribuição e Receber Certificado
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Contributors Wall */}
      {contributors && contributors.length > 0 && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mural de Contribuidores
            </CardTitle>
            <CardDescription>
              Agradecemos a todos que apoiam nosso ministério
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributors.slice(0, 6).map((contributor: any) => (
                <div
                  key={contributor.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 bg-green-100 rounded-full">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{contributor.name}</p>
                    <p className="text-sm text-gray-500">
                      {contributionTypes.find(t => t.value === contributor.contributionType)?.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {contributors.length > 6 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                E mais {contributors.length - 6} contribuidores...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Impact Information */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-800 mb-2">
              Como sua contribuição nos ajuda
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">🚀 Desenvolvimento Tecnológico:</h4>
              <ul className="space-y-1">
                <li>• Manutenção e melhoria do aplicativo</li>
                <li>• Integração com IA para orientação espiritual</li>
                <li>• Novos recursos e funcionalidades</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📖 Conteúdo Espiritual:</h4>
              <ul className="space-y-1">
                <li>• E-books cristãos gratuitos</li>
                <li>• Conteúdo devocional diário</li>
                <li>• Recursos para crescimento espiritual</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}